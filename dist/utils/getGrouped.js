"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGroups = getGroups;
exports.calculateSectionPercentageValue = calculateSectionPercentageValue;
exports.default = getGroupedData;

var _settings = require("./settings");

var _lodash = _interopRequireDefault(require("lodash.filter"));

var _getAggregated = _interopRequireDefault(require("./getAggregated"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// This function creates a combined key that is used to aggregated data.
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
}

function calculateSectionPercentageValue(value, key, subTotalsSet, valKey) {
  var keyPrefix = key.split(_settings.separator)[0];
  var subtotalSectionKey = (0, _lodash.default)(Object.keys(subTotalsSet), function (x) {
    return x.includes("".concat(keyPrefix).concat(_settings.separator));
  })[0];

  if (key === subtotalSectionKey) {
    return '100.00%';
  }

  return "".concat((value / subTotalsSet[subtotalSectionKey][valKey] * 100).toFixed(2), "%");
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
      grouped[key] = (0, _getAggregated.default)(grouped[key], vals, postprocessfn);

      if (!postprocessfn) {
        groupedOriginals[key] = grouped[key];
      } else {
        groupedOriginals[key] = (0, _getAggregated.default)(groupedOriginals[key], vals);
      }
    });

    var _valueTotals = (0, _getAggregated.default)(data, vals, postprocessfn);

    return {
      groupedOriginals: groupedOriginals,
      grouped: grouped,
      valueTotals: _valueTotals
    };
  } // Get the reduced values by key.


  Object.keys(grouped).forEach(function (key) {
    grouped[key] = (0, _getAggregated.default)(grouped[key], vals, postprocessfn);
  });
  var valueTotals = (0, _getAggregated.default)(data, vals, postprocessfn);

  if (vals.length === 1 && (calculateTotalsPercentage || calculateSectionPercentage && showSectionTotals)) {
    var subTotalsSet;
    var valKey = vals[0].field;

    if (showSectionTotals && calculateSectionPercentage) {
      subTotalsSet = (0, _lodash.default)(Object.keys(grouped), function (key) {
        return key.includes(_settings.subtotalsSuffix);
      }).reduce(function (obj, key) {
        obj[key] = grouped[key];
        return obj;
      }, {});
    }

    var groupedPerc = Object.keys(grouped).reduce(function (obj, key) {
      var value = grouped[key][valKey];
      obj[key] = _objectSpread(_objectSpread({}, grouped[key]), {}, {
        perc_section: calculateSectionPercentage && showSectionTotals ? calculateSectionPercentageValue(value, key, subTotalsSet, valKey) : null,
        perc_total: calculateTotalsPercentage ? "".concat((value / valueTotals[valKey] * 100).toFixed(2), "%") : null
      });
      return obj;
    }, {});

    var valueTotalsPerc = _objectSpread(_objectSpread({}, valueTotals), {}, {
      perc_section: calculateSectionPercentage && showSectionTotals ? '100.00%' : null,
      perc_total: calculateTotalsPercentage ? '100.00%' : null
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