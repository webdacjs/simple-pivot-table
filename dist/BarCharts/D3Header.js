"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = D3Header;

var _react = _interopRequireDefault(require("react"));

var _d3hook = _interopRequireDefault(require("./d3hook.js"));

var _d3chartBuilder = _interopRequireDefault(require("./d3chartBuilder"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function D3Header(_ref) {
  var height = _ref.height,
      legendValues = _ref.legendValues;

  var getWidth = function getWidth(val) {
    return (val + 1 * 100) / legendValues.length;
  };

  var builtDataObject = legendValues.map(function (x, i) {
    return {
      dimension: x,
      text: x,
      y: 0,
      width: getWidth(i),
      height: height || 16,
      color: 'transparent',
      fontColor: '#495057'
    };
  });
  var widths = builtDataObject.map(function (x) {
    return x.width;
  });
  var builtDataObjectWithX = builtDataObject.map(function (item, index) {
    return Object.assign(item, {
      x: index === 0 ? 0 : widths.slice(0, index).reduce(function (a, b) {
        return a + b;
      }, 0),
      textX: index === 0 ? 0 : widths.slice(0, index).reduce(function (a, b) {
        return a + b;
      }, 0) + widths[index] / 2
    });
  });
  var ref = (0, _d3hook.default)(function (svg) {
    svg.selectAll('*').remove();
    (0, _d3chartBuilder.default)(svg, builtDataObjectWithX, true, function () {
      return console.log;
    });
  }, [legendValues]);
  return /*#__PURE__*/_react.default.createElement("svg", {
    className: "svgHeader",
    ref: ref,
    style: {
      height: height,
      width: '100%',
      marginTop: '0px',
      marginRight: '0px',
      marginLeft: '0px'
    }
  });
}