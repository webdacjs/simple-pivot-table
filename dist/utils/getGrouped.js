"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getGroupedData;

var _settings = require("./settings");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getReducedValue(values, aggregator, formatter) {
  if (aggregator === 'sum') {
    var rawValue = values.reduce(function (a, b) {
      return a + (b || 0);
    }, 0);
    return formatter ? formatter(rawValue) : rawValue;
  }

  if (aggregator === 'avg') {
    var _rawValue = values.reduce(function (a, b) {
      return a + (b || a);
    }, 0) / values.length;

    return formatter ? formatter(_rawValue) : _rawValue;
  }

  if (aggregator === 'median') {
    var _rawValue2 = values[Math.round(values.length / 2)];
    return formatter ? formatter(_rawValue2) : _rawValue2;
  } // default count


  return values.length;
}

function getAggregatedValues(items, vals, postprocessfn) {
  var reduced = {};
  vals.forEach(function (val) {
    var values = items.map(function (item) {
      return item[val.field];
    });
    reduced[val.field] = getReducedValue(values, val.aggregator, val.formatter);
  });
  return postprocessfn ? postprocessfn(reduced) : reduced;
} // This function creates a combined key that is used to aggregated data.
// ie. Europe___Switzerland, etc


function getCombinedKeyBasedOnRowAttributes(dataItem, rowAttributes) {
  var keyArray = [];
  rowAttributes.forEach(function (rowAttribute, i) {
    keyArray.push(dataItem[rowAttribute] || ' ');
  });
  var combinedKeyArray = keyArray.join(_settings.separator);
  return combinedKeyArray;
} // Get the data combined by attribute including the mutations done by th postprocess function
// with the originals if required.


function getGroupedData(_ref) {
  var data = _ref.data,
      rowAttributes = _ref.rowAttributes,
      vals = _ref.vals,
      postprocessfn = _ref.postprocessfn,
      getOriginalsFlag = _ref.getOriginalsFlag,
      totalsUnformatters = _ref.totalsUnformatters;
  var grouped = {};
  data.forEach(function (dataItem) {
    var combinedKeyArray = getCombinedKeyBasedOnRowAttributes(dataItem, rowAttributes);
    grouped[combinedKeyArray] = grouped[combinedKeyArray] || [];
    grouped[combinedKeyArray].push(dataItem);
  });

  if (getOriginalsFlag) {
    var groupedOriginals = _objectSpread({}, grouped);

    Object.keys(grouped).forEach(function (key) {
      grouped[key] = getAggregatedValues(grouped[key], vals, postprocessfn);

      if (!postprocessfn) {
        groupedOriginals[key] = grouped[key];
      } else {
        groupedOriginals[key] = getAggregatedValues(groupedOriginals[key], vals);
      }
    });

    var _valueTotals = getAggregatedValues(data, vals, postprocessfn);

    return {
      groupedOriginals: groupedOriginals,
      grouped: grouped,
      valueTotals: _valueTotals
    };
  }

  var totals = []; // Get the reduced values by key.

  Object.keys(grouped).forEach(function (key) {
    grouped[key] = getAggregatedValues(grouped[key], vals, postprocessfn);
    totals.push(grouped[key]);
  });
  var totalsUnformatted = totals.map(function (item) {
    if (!totalsUnformatters) {
      return item;
    }

    return Object.keys(item).reduce(function (obj, key) {
      obj[key] = totalsUnformatters[key] ? totalsUnformatters[key](item[key]) : item[key];
      return obj;
    }, {});
  });
  var valueTotals = getAggregatedValues(totalsUnformatted, vals, postprocessfn);
  return {
    grouped: grouped,
    valueTotals: valueTotals
  };
}