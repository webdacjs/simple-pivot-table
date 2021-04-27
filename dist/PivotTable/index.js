"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = PivotTable;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _pivotMain = _interopRequireDefault(require("../utils/pivotMain"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function PivotTable(_ref) {
  var columnsLabels = _ref.columnsLabels,
      data = _ref.data,
      filters = _ref.filters,
      height = _ref.height,
      maxHeight = _ref.maxHeight,
      maxWidth = _ref.maxWidth,
      postprocessfn = _ref.postprocessfn,
      rows = _ref.rows,
      showColumnTotals = _ref.showColumnTotals,
      showRowsTotals = _ref.showRowsTotals,
      values = _ref.values,
      width = _ref.width;

  var _useState = (0, _react.useState)(),
      _useState2 = _slicedToArray(_useState, 2),
      cols = _useState2[0],
      setCols = _useState2[1];

  var _useState3 = (0, _react.useState)(),
      _useState4 = _slicedToArray(_useState3, 2),
      pivotRows = _useState4[0],
      setRows = _useState4[1];

  var _useState5 = (0, _react.useState)(),
      _useState6 = _slicedToArray(_useState5, 2),
      colsTotals = _useState6[0],
      setColsTotals = _useState6[1];

  var _useState7 = (0, _react.useState)(),
      _useState8 = _slicedToArray(_useState7, 2),
      selectedRow = _useState8[0],
      setSelectedRow = _useState8[1];

  (0, _react.useEffect)(function () {
    var _getPivotDataColumns = (0, _pivotMain.default)({
      data: data,
      filters: filters,
      rows: rows,
      values: values,
      columnsLabels: columnsLabels,
      postprocessfn: postprocessfn
    }),
        pivotData = _getPivotDataColumns.pivotData,
        colsValues = _getPivotDataColumns.colsValues,
        colsTotals = _getPivotDataColumns.colsTotals;

    setColsTotals(colsTotals);
    setCols(colsValues);
    setRows(pivotData);
  }, [data, rows, values, columnsLabels]); // eslint-disable-line

  var getRowClassName = function getRowClassName(rowid) {
    return rowid === selectedRow ? 'selected' : null;
  };

  var setSelectedRowFn = function setSelectedRowFn(rowid) {
    if (rowid !== selectedRow) {
      setSelectedRow(rowid);
      return;
    }

    setSelectedRow();
  };

  var getColumnLabel = function getColumnLabel(col, i) {
    return columnsLabels && columnsLabels[i] ? columnsLabels[i] : col;
  };

  var getHeader = function getHeader() {
    return /*#__PURE__*/_react.default.createElement("thead", null, /*#__PURE__*/_react.default.createElement("tr", null, cols.slice(0, rows.length).map(function (col, i) {
      return /*#__PURE__*/_react.default.createElement("th", {
        key: "col-".concat(i),
        className: "pivotHeader"
      }, getColumnLabel(col, i));
    }), cols.slice(rows.length, 100).map(function (col, i) {
      return /*#__PURE__*/_react.default.createElement("th", {
        key: "col-".concat(i + rows.length),
        className: "pivotHeaderValue"
      }, getColumnLabel(col, i + rows.length));
    })));
  };

  var getRowLine = function getRowLine(row, i) {
    var rowItems = row.map(function (item, y) {
      if (item.type === 'header' && item.visible) {
        return /*#__PURE__*/_react.default.createElement("th", {
          key: "th-".concat(i, "-").concat(y),
          rowSpan: item.rowSpan,
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

  var getColumnTotalsRow = function getColumnTotalsRow() {
    return /*#__PURE__*/_react.default.createElement("tr", null, /*#__PURE__*/_react.default.createElement("th", {
      key: "th-totals-col",
      colSpan: rows.length,
      className: "pivotRowHeaderTotal"
    }, "Totals:"), Object.keys(colsTotals).map(function (item, i) {
      return /*#__PURE__*/_react.default.createElement("td", {
        key: "td-totals-td-".concat(i),
        className: "pivotRowValueTotal"
      }, colsTotals[item]);
    }));
  };

  var getRows = function getRows() {
    return /*#__PURE__*/_react.default.createElement("tbody", null, pivotRows.map(function (row, i) {
      return /*#__PURE__*/_react.default.createElement("tr", {
        key: "row-".concat(i),
        className: getRowClassName("row-".concat(i)),
        onClick: function onClick() {
          return setSelectedRowFn("row-".concat(i));
        }
      }, getRowLine(row, i));
    }), showColumnTotals && getColumnTotalsRow());
  };

  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("table", {
    className: "simple-pivot-table",
    style: {
      width: width,
      height: height,
      maxWidth: maxWidth,
      maxHeight: maxHeight
    }
  }, cols && getHeader(), cols && pivotRows && getRows()));
}

PivotTable.propTypes = {
  columnsLabels: _propTypes.default.array,
  data: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.array]),
  filters: _propTypes.default.array,
  height: _propTypes.default.string,
  maxHeight: _propTypes.default.string,
  maxWidth: _propTypes.default.string,
  postprocessfn: _propTypes.default.func,
  rows: _propTypes.default.array,
  showColumnTotals: _propTypes.default.bool,
  showRowsTotals: _propTypes.default.bool,
  values: _propTypes.default.array,
  width: _propTypes.default.string
};