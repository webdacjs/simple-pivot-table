"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ExperimentalPivotTable;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _pivotMain = _interopRequireDefault(require("../utils/pivotMain"));

var _getGrouped = _interopRequireDefault(require("../utils/getGrouped"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ExperimentalPivotTable(_ref) {
  var columnsLabels = _ref.columnsLabels,
      columns = _ref.columns,
      data = _ref.data,
      filters = _ref.filters,
      height = _ref.height,
      maxHeight = _ref.maxHeight,
      maxWidth = _ref.maxWidth,
      orderBy = _ref.orderBy,
      postprocessfn = _ref.postprocessfn,
      rows = _ref.rows,
      showColumnTotals = _ref.showColumnTotals,
      showRowsTotals = _ref.showRowsTotals,
      showSectionTotals = _ref.showSectionTotals,
      calculateSectionPercentage = _ref.calculateSectionPercentage,
      calculateTotalsPercentage = _ref.calculateTotalsPercentage,
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

  function postprocessfnLocal(reduced, items) {
    var _getGroupedData = (0, _getGrouped.default)({
      data: items,
      rowAttributes: columns.map(function (x) {
        return x.field;
      }),
      vals: values
    }),
        grouped = _getGroupedData.grouped;

    var combinedKeysWithVals = values.map(function (x) {
      return x.field;
    }).reduce(function (obj, item) {
      var combinedKeyPrefix = "".concat(item, "___");
      columns[0].allowedValues.map(function (value) {
        obj["".concat(combinedKeyPrefix, "___").concat(value)] = (grouped[value] || _defineProperty({}, value, _defineProperty({}, item, '')))[item];
      });
      return obj;
    }, {}); // Create New Return Object.

    return combinedKeysWithVals;
  }

  var postprocessfnToUse = postprocessfn || postprocessfnLocal;
  (0, _react.useEffect)(function () {
    var _getPivotDataColumns = (0, _pivotMain.default)({
      data: data,
      filters: filters,
      rows: rows,
      values: values,
      columnsLabels: columnsLabels,
      orderBy: orderBy,
      postprocessfn: postprocessfnToUse,
      showSectionTotals: showSectionTotals,
      calculateSectionPercentage: calculateSectionPercentage,
      calculateTotalsPercentage: calculateTotalsPercentage
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

  var getRootColumnLength = function getRootColumnLength() {
    return columns[0].allowedValues.length * values.length;
  };

  var getHeader = function getHeader() {
    return /*#__PURE__*/_react.default.createElement("thead", null, columns && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("tr", null, /*#__PURE__*/_react.default.createElement("th", {
      colspan: rows.length
    }, ' '), /*#__PURE__*/_react.default.createElement("th", {
      colspan: getRootColumnLength(),
      style: {
        textAlign: 'center'
      }
    }, columns[0].label || columns[0].field)), /*#__PURE__*/_react.default.createElement("tr", null, /*#__PURE__*/_react.default.createElement("th", {
      colspan: rows.length
    }, ' '), values.map(function (x, i) {
      return /*#__PURE__*/_react.default.createElement("th", {
        style: {
          textAlign: 'center'
        },
        colspan: columns[0].allowedValues.length
      }, x.label || x.field);
    }))), /*#__PURE__*/_react.default.createElement("tr", null, cols.slice(0, rows.length).map(function (col, i) {
      return /*#__PURE__*/_react.default.createElement("th", {
        key: "col-".concat(i),
        className: "pivotHeader"
      }, getColumnLabel(col, i));
    }), !columns && cols.slice(rows.length, 100).map(function (col, i) {
      return /*#__PURE__*/_react.default.createElement("th", {
        key: "col-".concat(i + rows.length),
        className: "pivotHeaderValue"
      }, getColumnLabel(col, i + rows.length));
    }), columns && values.map(function () {
      return columns[0].allowedValues.slice();
    }).flat().map(function (x, i) {
      return /*#__PURE__*/_react.default.createElement("th", {
        key: "internal",
        className: "pivotHeaderValue pivotHeaderInternal",
        style: {
          textAlign: 'center'
        }
      }, x);
    })));
  };

  var getLineClass = function getLineClass(baseClass, item) {
    return item.totalsLine ? "".concat(baseClass, " pivotSubtotal") : baseClass;
  };

  var getRowLine = function getRowLine(row, i) {
    var rowItems = row.map(function (item, y) {
      if (item.type === 'header' && item.visible) {
        return /*#__PURE__*/_react.default.createElement("th", {
          key: "th-".concat(i, "-").concat(y),
          rowSpan: item.rowSpan,
          className: getLineClass('pivotRowHeader', item)
        }, item.value);
      } else if (item.type === 'value') {
        return /*#__PURE__*/_react.default.createElement("td", {
          key: "td-".concat(i, "-").concat(y),
          className: getLineClass('pivotValue', item)
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

ExperimentalPivotTable.propTypes = {
  columnsLabels: _propTypes.default.array,
  columns: _propTypes.default.array,
  data: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.array]),
  filters: _propTypes.default.array,
  height: _propTypes.default.string,
  maxHeight: _propTypes.default.string,
  maxWidth: _propTypes.default.string,
  orderBy: _propTypes.default.array,
  postprocessfn: _propTypes.default.func,
  rows: _propTypes.default.array,
  showColumnTotals: _propTypes.default.bool,
  showRowsTotals: _propTypes.default.bool,
  showSectionTotals: _propTypes.default.bool,
  calculateSectionPercentage: _propTypes.default.bool,
  calculateTotalsPercentage: _propTypes.default.bool,
  values: _propTypes.default.array,
  width: _propTypes.default.string
};