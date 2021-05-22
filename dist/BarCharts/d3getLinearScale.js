"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getLinearScale;

var d3 = _interopRequireWildcard(require("d3"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function defaultFormatter(x) {
  if (x > 1000000) {
    return "".concat((x / 1000000).toFixed(2), " M");
  } else if (x > 1000) {
    return "".concat((x / 1000).toFixed(2), " k");
  } // Avoid many decimal points in the legend.


  var value = Math.round(x) === x ? x : x.toFixed(2);
  return value;
}

function getLinearScale(minVal, maxVal, steps, legendFormatter) {
  var getScale = d3.scaleLinear().domain([minVal, maxVal]).range([0, maxVal]);
  var factor = maxVal / steps;
  var scaleValues = [];

  for (var i = 0; i <= steps; i++) {
    scaleValues.push(getScale(i * factor));
  }

  return scaleValues.map(function (x) {
    return legendFormatter ? legendFormatter(x) : defaultFormatter(x);
  });
}