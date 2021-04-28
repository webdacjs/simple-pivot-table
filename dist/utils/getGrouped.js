"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNumericValue = getNumericValue;
exports.getReducedValue = getReducedValue;
exports.getGroups = getGroups;
exports.default = getGroupedData;

var _settings = require("./settings");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getNumericValue(value) {
  var numValue = parseFloat(value);

  if (isNaN(numValue)) {
    return 0;
  }

  return numValue;
}

function getReducedValue(values, aggregator, formatter) {
  if (aggregator === 'sum') {
    var rawValue = values.reduce(function (a, b) {
      return a + (getNumericValue(b) || 0);
    }, 0);
    return formatter ? formatter(rawValue) : rawValue;
  }

  if (aggregator === 'avg') {
    var _rawValue = values.reduce(function (a, b) {
      return a + (getNumericValue(b) || a);
    }, 0) / values.length;

    return formatter ? formatter(_rawValue) : _rawValue;
  }

  if (aggregator === 'median') {
    var _rawValue2 = values[Math.round(values.length / 2)];
    return formatter ? formatter(_rawValue2) : _rawValue2;
  }

  if (typeof aggregator === 'function') {
    var _rawValue3 = values.reduce(function (a, b) {
      return aggregator(a, b);
    });

    return formatter ? formatter(_rawValue3) : _rawValue3;
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
}

function getGroups(data, rowAttributes, showSectionTotals) {
  var grouped = {};
  data.forEach(function (dataItem) {
    var combinedKeyArray = getCombinedKeyBasedOnRowAttributes(dataItem, rowAttributes);
    grouped[combinedKeyArray] = grouped[combinedKeyArray] || [];
    grouped[combinedKeyArray].push(dataItem);

    if (showSectionTotals && rowAttributes.length > 1) {
      var combinedSplit = combinedKeyArray.split(_settings.separator);

      var getTotalLabel = function getTotalLabel(i) {
        return i === combinedSplit.length - 1 ? "".concat(_settings.subtotalsSuffix, "Totals") : _settings.subtotalsSuffix;
      };

      var combinedKeyshowSectionTotals = combinedSplit.map(function (x, i) {
        return i === 0 ? x : getTotalLabel(i);
      }).join(_settings.separator);
      grouped[combinedKeyshowSectionTotals] = grouped[combinedKeyshowSectionTotals] || [];
      grouped[combinedKeyshowSectionTotals].push(dataItem);
    }
  });
  return grouped;
} // Get the data combined by attribute including the mutations done by th postprocess function
// with the originals if required.


function getGroupedData(_ref) {
  var data = _ref.data,
      rowAttributes = _ref.rowAttributes,
      vals = _ref.vals,
      postprocessfn = _ref.postprocessfn,
      getOriginalsFlag = _ref.getOriginalsFlag,
      showSectionTotals = _ref.showSectionTotals,
      calculateSectionPercentage = _ref.calculateSectionPercentage,
      calculateTotalsPercentage = _ref.calculateTotalsPercentage;
  var grouped = getGroups(data, rowAttributes, showSectionTotals);

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
  } // Get the reduced values by key.


  Object.keys(grouped).forEach(function (key) {
    grouped[key] = getAggregatedValues(grouped[key], vals, postprocessfn);
  });
  var valueTotals = getAggregatedValues(data, vals, postprocessfn);

  if (vals.length === 1 && calculateTotalsPercentage) {
    var valKey = vals[0].field;
    var groupedPerc = Object.keys(grouped).reduce(function (obj, key) {
      obj[key] = _objectSpread(_objectSpread({}, grouped[key]), {}, {
        perc_total: "".concat((grouped[key][valKey] / valueTotals[valKey] * 100).toFixed(2), "%")
      });
      return obj;
    }, {});

    var valueTotalsPerc = _objectSpread(_objectSpread({}, valueTotals), {}, {
      perc_total: '100%'
    });

    return {
      grouped: groupedPerc,
      valueTotals: valueTotalsPerc
    };
  }

  return {
    grouped: grouped,
    valueTotals: valueTotals
  };
}