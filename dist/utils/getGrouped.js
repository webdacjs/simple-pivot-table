"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getGroupedData;

var _settings = require("./settings");

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
}

function getGroupedData(data, rows, vals, postprocessfn) {
  var grouped = {};
  data.forEach(function (dataItem) {
    var keyArray = [];
    rows.forEach(function (row, i) {
      keyArray.push(dataItem[row] || 'null');
    });
    var combinedKeyArray = keyArray.join(_settings.separator);
    grouped[combinedKeyArray] = grouped[combinedKeyArray] || [];
    grouped[combinedKeyArray].push(dataItem);
  }); // Get the reduced values by key.

  Object.keys(grouped).forEach(function (key) {
    grouped[key] = getAggregatedValues(grouped[key], vals, postprocessfn);
  });
  var valueTotals = getAggregatedValues(data, vals, postprocessfn);
  return {
    grouped: grouped,
    valueTotals: valueTotals
  };
}