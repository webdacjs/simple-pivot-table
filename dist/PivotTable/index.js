"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = PivotTable;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _getGrouped = _interopRequireDefault(require("../utils/getGrouped"));

var _getDenormalized = _interopRequireDefault(require("../utils/getDenormalized"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function PivotTable(_ref) {
  var data = _ref.data,
      filters = _ref.filters,
      rows = _ref.rows,
      columns = _ref.columns,
      columnsLabels = _ref.columnsLabels,
      width = _ref.width,
      values = _ref.values,
      height = _ref.height,
      postprocessfn = _ref.postprocessfn;

  var _useState = (0, _react.useState)(),
      _useState2 = _slicedToArray(_useState, 2),
      cols = _useState2[0],
      setCols = _useState2[1];

  var _useState3 = (0, _react.useState)(),
      _useState4 = _slicedToArray(_useState3, 2),
      pivotRows = _useState4[0],
      setRows = _useState4[1];

  function getColumns() {
    if (columnsLabels) {
      return columnsLabels;
    }

    return [].concat(_toConsumableArray(rows), _toConsumableArray(values.map(function (x) {
      return x.field;
    })));
  }

  (0, _react.useEffect)(function () {
    var groupedData = (0, _getGrouped.default)(getFilteredRows(data), rows, values, postprocessfn);
    var denormalizedData = (0, _getDenormalized.default)(groupedData, rows, values);
    setCols(getColumns());
    setRows(denormalizedData);
  }, []); // eslint-disable-line

  function filterIterations(rawRows) {
    var filteredRows = _toConsumableArray(rawRows);

    filters.forEach(function (filterFn) {
      filteredRows = filteredRows.filter(filterFn);
    });
    return filteredRows;
  }

  var getFilteredRows = function getFilteredRows(rawRows) {
    return filters ? filterIterations(rawRows) : rawRows;
  };

  var getColumnLabel = function getColumnLabel(col, i) {
    return columnsLabels && columnsLabels[i] ? columnsLabels[i] : col;
  };

  var getHeader = function getHeader() {
    return /*#__PURE__*/_react.default.createElement("thead", null, /*#__PURE__*/_react.default.createElement("tr", null, cols.map(function (col, i) {
      return /*#__PURE__*/_react.default.createElement("th", {
        key: "col-".concat(i),
        className: "pivotHeader"
      }, getColumnLabel(col, i));
    })));
  };

  var getRowLine = function getRowLine(row, i) {
    var rowItems = row.map(function (item, y) {
      if (item.type === 'header' && item.visible) {
        return /*#__PURE__*/_react.default.createElement("th", {
          key: "th-".concat(i, "-").concat(y),
          rowspan: item.rowSpan,
          className: "pivotRowHeader"
        }, item.value);
      } else if (item.type === 'value') {
        return /*#__PURE__*/_react.default.createElement("td", {
          key: "td-".concat(i, "-").concat(y),
          className: "pivotValue"
        }, item.value);
      }
    });
    return rowItems.filter(function (x) {
      return x;
    });
  };

  var getRows = function getRows() {
    return /*#__PURE__*/_react.default.createElement("tbody", null, pivotRows.map(function (row, i) {
      return /*#__PURE__*/_react.default.createElement("tr", {
        key: "row-".concat(i)
      }, getRowLine(row, i));
    }));
  };

  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("table", {
    className: "table",
    style: {
      width: width,
      height: height
    }
  }, cols && getHeader(), cols && pivotRows && getRows()));
}

PivotTable.propTypes = {
  data: _propTypes.default.array,
  rows: _propTypes.default.array,
  columns: _propTypes.default.array,
  columnsLabels: _propTypes.default.array,
  values: _propTypes.default.array,
  filters: _propTypes.default.array,
  height: _propTypes.default.number,
  postprocessfn: _propTypes.default.func,
  width: _propTypes.default.number
};