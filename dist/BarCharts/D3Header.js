"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = D3Header;

var _react = _interopRequireDefault(require("react"));

var _d3hook = _interopRequireDefault(require("./d3hook.js"));

var _nanoid = require("nanoid");

var _d3chartBuilder = _interopRequireDefault(require("./d3chartBuilder"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function D3Header(_ref) {
  var height = _ref.height,
      legendValues = _ref.legendValues;
  var stepvalue = 100 / (legendValues.length - 1);

  var getWidth = function getWidth(i) {
    return stepvalue * i;
  };

  var builtDataObject = legendValues.map(function (x, i) {
    return {
      dimension: x,
      text: x,
      y: 0,
      width: i === 0 ? 0 : getWidth(i),
      x: 0,
      textX: i === 0 ? 0 : getWidth(i),
      height: height || 16,
      color: 'transparent',
      fontColor: '#495057'
    };
  });
  var ref = (0, _d3hook.default)(function (svg) {
    svg.selectAll('*').remove();
    (0, _d3chartBuilder.default)(svg, builtDataObject, true, function () {
      return console.log;
    });
  }, [legendValues]);
  return /*#__PURE__*/_react.default.createElement("svg", {
    className: "svgHeader",
    ref: ref,
    key: (0, _nanoid.nanoid)(),
    style: {
      height: height,
      width: '100%',
      marginTop: '0px',
      marginRight: '0px',
      marginLeft: '0px'
    }
  });
}