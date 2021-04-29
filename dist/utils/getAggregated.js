"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNumericValue = getNumericValue;
exports.getReducedValue = getReducedValue;
exports.default = getAggregatedValues;

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
  return postprocessfn ? postprocessfn(reduced, items) : reduced;
}