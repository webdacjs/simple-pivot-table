"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = GaugeChart;

var _react = _interopRequireDefault(require("react"));

var _d3hook = _interopRequireDefault(require("./d3hook.js"));

var _d3chartBuilder = _interopRequireDefault(require("./d3chartBuilder"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function GaugeChart(_ref) {
  var dataElement = _ref.dataElement,
      maxValue = _ref.maxValue,
      minValue = _ref.minValue,
      dimensions = _ref.dimensions,
      colors = _ref.colors,
      height = _ref.height,
      showBarValues = _ref.showBarValues,
      usePercentages = _ref.usePercentages;
  var suffix = usePercentages ? '%' : '';

  var randomColor = function randomColor() {
    return Math.floor(Math.random() * 16777215).toString(16);
  };

  var getWidth = function getWidth(val) {
    return val * 100 / maxValue;
  };

  var values = dimensions.map(function (x) {
    return dataElement[x];
  });

  function getAdustedX(val) {
    if (!minValue || minValue > 0) {
      return val;
    }

    if (values.includes(minValue)) {
      return val;
    }

    return val + Math.abs(minValue);
  }

  var chartHeight = height || 30;
  var yOffset = chartHeight / 3 / 2.3;
  var innerheight = chartHeight / 3 * 2;
  var chartColors = colors || ['#4e79a7', '#e05759', '#f28e2c'];
  var builtDataObject = dimensions.map(function (x, i) {
    return {
      dimension: x,
      y: i === 0 ? 0 : yOffset,
      text: "".concat(Math.round(dataElement[x])).concat(suffix),
      width: getWidth(dataElement[x]),
      height: i === 0 ? chartHeight : innerheight,
      color: chartColors[i] || randomColor()
    };
  });
  var widths = builtDataObject.map(function (x) {
    return x.width;
  });
  var builtDataObjectWithX = builtDataObject.map(function (item, index) {
    return Object.assign(item, {
      x: index <= 1 ? getAdustedX(0, item) : getAdustedX(widths.slice(1, index).reduce(function (a, b) {
        return a + b;
      }, 0), item)
    });
  });
  var ref = (0, _d3hook.default)(function (svg) {
    (0, _d3chartBuilder.default)(svg, builtDataObjectWithX, showBarValues, function () {
      return console.log;
    });
  }, [dataElement]);
  return /*#__PURE__*/_react.default.createElement("svg", {
    ref: ref,
    style: {
      height: chartHeight,
      width: '100%',
      marginTop: '0px',
      marginRight: '0px',
      marginLeft: '0px'
    }
  });
}