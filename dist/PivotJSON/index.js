"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = PivotJSON;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _pivotMain = require("../utils/pivotMain");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function PivotJSON(_ref) {
  var data = _ref.data,
      filters = _ref.filters,
      rows = _ref.rows,
      columnsLabels = _ref.columnsLabels,
      values = _ref.values,
      postprocessfn = _ref.postprocessfn,
      showColumnTotals = _ref.showColumnTotals,
      showRowsTotals = _ref.showRowsTotals,
      showSectionTotals = _ref.showSectionTotals,
      calculateSectionPercentage = _ref.calculateSectionPercentage,
      calculateTotalsPercentage = _ref.calculateTotalsPercentage,
      getTree = _ref.getTree;

  var _useState = (0, _react.useState)(),
      _useState2 = _slicedToArray(_useState, 2),
      JSONData = _useState2[0],
      setJSONData = _useState2[1];

  (0, _react.useEffect)(function () {
    var JSONContents = (0, _pivotMain.getPivotJsonData)({
      data: data,
      filters: filters,
      rows: rows,
      values: values,
      columnsLabels: columnsLabels,
      postprocessfn: postprocessfn,
      showColumnTotals: showColumnTotals,
      showSectionTotals: showSectionTotals,
      calculateSectionPercentage: calculateSectionPercentage,
      calculateTotalsPercentage: calculateTotalsPercentage,
      getTree: getTree
    });
    setJSONData(JSONContents);
  }, [data, rows, values, columnsLabels]); // eslint-disable-line

  return /*#__PURE__*/_react.default.createElement("div", null, JSONData && /*#__PURE__*/_react.default.createElement("textarea", {
    style: {
      width: '100%',
      height: '500px'
    },
    value: JSON.stringify(JSONData, null, 4),
    readOnly: true
  }));
}

PivotJSON.propTypes = {
  data: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.array]),
  rows: _propTypes.default.array,
  columns: _propTypes.default.array,
  columnsLabels: _propTypes.default.array,
  values: _propTypes.default.array,
  filters: _propTypes.default.array,
  height: _propTypes.default.number,
  getTree: _propTypes.default.bool,
  postprocessfn: _propTypes.default.func,
  showColumnTotals: _propTypes.default.bool,
  showRowsTotals: _propTypes.default.bool,
  showSectionTotals: _propTypes.default.bool,
  calculateSectionPercentage: _propTypes.default.bool,
  calculateTotalsPercentage: _propTypes.default.bool,
  width: _propTypes.default.number
};