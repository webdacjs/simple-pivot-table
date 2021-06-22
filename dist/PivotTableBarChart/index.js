"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = PivotTableBarChart;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = _interopRequireDefault(require("lodash.filter"));

var _pivotMain = _interopRequireDefault(require("../utils/pivotMain"));

var _settings = require("../utils/settings");

var _getChunks = _interopRequireDefault(require("../utils/getChunks"));

var _GaugeChart = _interopRequireDefault(require("../BarCharts/GaugeChart"));

var _StackChart = _interopRequireDefault(require("../BarCharts/StackChart"));

var _D3Header = _interopRequireDefault(require("../BarCharts/D3Header"));

var _d3getLinearScale = _interopRequireDefault(require("../BarCharts/d3getLinearScale"));

var _getMinMaxValue = _interopRequireDefault(require("../BarCharts/getMinMaxValue"));

var _PopOver = _interopRequireDefault(require("../PopOver/"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function PivotTableBarChart(_ref) {
  var barLegendFormatter = _ref.barLegendFormatter,
      _ref$barLegendSteps = _ref.barLegendSteps,
      barLegendSteps = _ref$barLegendSteps === void 0 ? 10 : _ref$barLegendSteps,
      _ref$barType = _ref.barType,
      barType = _ref$barType === void 0 ? 'gauge' : _ref$barType,
      _ref$barsHeight = _ref.barsHeight,
      barsHeight = _ref$barsHeight === void 0 ? 15 : _ref$barsHeight,
      barsMaxValue = _ref.barsMaxValue,
      _ref$barsMinValue = _ref.barsMinValue,
      barsMinValue = _ref$barsMinValue === void 0 ? 0 : _ref$barsMinValue,
      columnsLabels = _ref.columnsLabels,
      colors = _ref.colors,
      data = _ref.data,
      filters = _ref.filters,
      height = _ref.height,
      hideColumns = _ref.hideColumns,
      highlightRows = _ref.highlightRows,
      maxHeight = _ref.maxHeight,
      maxWidth = _ref.maxWidth,
      _ref$multiStackSplit = _ref.multiStackSplit,
      multiStackSplit = _ref$multiStackSplit === void 0 ? 2 : _ref$multiStackSplit,
      orderBy = _ref.orderBy,
      popOverFormatter = _ref.popOverFormatter,
      popOverFunction = _ref.popOverFunction,
      postprocessfn = _ref.postprocessfn,
      rows = _ref.rows,
      rowsLimit = _ref.rowsLimit,
      showPopOver = _ref.showPopOver,
      showRanking = _ref.showRanking,
      tableClassName = _ref.tableClassName,
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
      groupedDataState = _useState6[0],
      setGroupedDataState = _useState6[1];

  var _useState7 = (0, _react.useState)(),
      _useState8 = _slicedToArray(_useState7, 2),
      colsTotals = _useState8[0],
      setColsTotals = _useState8[1];

  var _useState9 = (0, _react.useState)(),
      _useState10 = _slicedToArray(_useState9, 2),
      maxValue = _useState10[0],
      setMaxValue = _useState10[1];

  var _useState11 = (0, _react.useState)(),
      _useState12 = _slicedToArray(_useState11, 2),
      minValue = _useState12[0],
      setMinValue = _useState12[1];

  var getOriginals = true;

  var getSlicedRows = function getSlicedRows(rows) {
    return rowsLimit ? rows.slice(0, rowsLimit) : rows;
  };

  (0, _react.useEffect)(function () {
    var _getPivotDataColumns = (0, _pivotMain.default)({
      data: data,
      filters: filters,
      rows: rows,
      values: values,
      columnsLabels: columnsLabels,
      orderBy: orderBy,
      showRanking: showRanking,
      postprocessfn: postprocessfn,
      getOriginals: getOriginals
    }),
        pivotData = _getPivotDataColumns.pivotData,
        colsValues = _getPivotDataColumns.colsValues,
        colsTotals = _getPivotDataColumns.colsTotals,
        groupedOriginals = _getPivotDataColumns.groupedOriginals;

    setColsTotals(colsTotals);
    setCols(colsValues);
    setRows(pivotData);
    setGroupedDataState(groupedOriginals);
    setMinValue(barsMinValue);

    if (!barsMaxValue) {
      var _getMinMaxValues = (0, _getMinMaxValue.default)(pivotData),
          calcMaxValue = _getMinMaxValues.calcMaxValue;

      setMaxValue(calcMaxValue);
    } else {
      setMaxValue(barsMaxValue);
    }
  }, [data, rows, values, columnsLabels]); // eslint-disable-line

  var getColumnLabel = function getColumnLabel(col, i) {
    return columnsLabels && columnsLabels[i] ? columnsLabels[i] : col;
  };

  var getColsLength = function getColsLength() {
    return showRanking ? rows.length + 1 : rows.length;
  };

  var getHeader = function getHeader() {
    return /*#__PURE__*/_react.default.createElement("thead", null, /*#__PURE__*/_react.default.createElement("tr", null, cols.slice(0, getColsLength()).map(function (col, i) {
      return /*#__PURE__*/_react.default.createElement("th", {
        key: "col-".concat(i),
        className: "pivotHeader"
      }, getColumnLabel(col, i));
    }), /*#__PURE__*/_react.default.createElement("th", {
      key: "bar-header",
      className: "bar-header"
    }, /*#__PURE__*/_react.default.createElement(_D3Header.default, {
      height: barsHeight,
      legendValues: (0, _d3getLinearScale.default)(minValue, maxValue, barLegendSteps, barLegendFormatter)
    }))));
  };

  var getValuesObj = function getValuesObj(row) {
    var values = (0, _lodash.default)(row, function (x) {
      return x.type === 'value';
    }).map(function (x) {
      return x.value;
    });
    var valuesCols = cols.slice(rows.length, 100);
    var valuesObj = values.reduce(function (obj, val, i) {
      obj[valuesCols[i]] = val;
      return obj;
    }, {});
    return {
      valuesObj: valuesObj,
      valuesCols: valuesCols
    };
  };

  function getBarChart(valuesObj, valuesCols, dataArray) {
    if (barType === 'gauge') {
      return /*#__PURE__*/_react.default.createElement(_PopOver.default, {
        showPopOver: showPopOver,
        dataArray: dataArray
      }, /*#__PURE__*/_react.default.createElement(_GaugeChart.default, {
        dataElement: valuesObj,
        dimensions: valuesCols,
        height: barsHeight,
        colors: colors,
        minValue: minValue,
        maxValue: maxValue
      }));
    } else if (barType === 'stack') {
      return /*#__PURE__*/_react.default.createElement(_PopOver.default, {
        showPopOver: showPopOver,
        dataArray: dataArray
      }, /*#__PURE__*/_react.default.createElement(_StackChart.default, {
        dataElement: valuesObj,
        dimensions: valuesCols,
        height: barsHeight,
        colors: colors,
        minValue: minValue,
        maxValue: maxValue
      }));
    } else if (barType === 'multistack') {
      var valuesColsChunks = (0, _getChunks.default)(valuesCols, multiStackSplit);
      var colorsChunks = (0, _getChunks.default)(colors);
      return /*#__PURE__*/_react.default.createElement(_PopOver.default, {
        showPopOver: showPopOver,
        dataArray: dataArray
      }, valuesColsChunks.map(function (chunk, index) {
        return /*#__PURE__*/_react.default.createElement(_StackChart.default, {
          key: "multiStack-".concat(index),
          dataElement: valuesObj,
          dimensions: chunk,
          height: barsHeight,
          colors: colorsChunks[index],
          minValue: minValue,
          maxValue: maxValue
        });
      }));
    }
  }

  var getPopOverDataArray = function getPopOverDataArray(headerItems, row) {
    if (!showPopOver) {
      return [];
    }

    if (popOverFunction) {
      return popOverFunction(row);
    }

    var headerLen = headerItems.length;
    var rowsLen = rows.length;
    var rowKey = !showRanking ? headerItems.map(function (x) {
      return x.value;
    }).join(_settings.separator) : [].concat(_toConsumableArray(headerItems.slice(0, headerLen - 2)), _toConsumableArray(headerItems.slice(headerLen - 1))).map(function (x) {
      return x.value;
    }).join(_settings.separator); // Popover Keys

    var popOverKeys = !showRanking ? rows : [].concat(_toConsumableArray(rows.slice(0, rowsLen - 1)), ['ranking'], _toConsumableArray(rows.slice(rowsLen - 1)));
    var originalValue = groupedDataState[rowKey];
    var dataArray = [];
    headerItems.forEach(function (item, i) {
      dataArray.push({
        key: popOverKeys[i],
        value: item.value
      });
    });
    Object.keys(originalValue).forEach(function (key) {
      var item = originalValue[key];
      dataArray.push({
        key: key,
        value: popOverFormatter ? popOverFormatter(item) : item
      });
    });
    return dataArray;
  };

  var getItemValue = function getItemValue(i, value) {
    if (hideColumns && hideColumns.includes(i + 1)) {
      return '';
    }

    return value;
  };

  var getHeaderClassName = function getHeaderClassName(value) {
    if (!highlightRows) {
      return 'pivotRowHeader';
    }

    if (highlightRows.includes(value)) {
      return 'pivotRowHeader pivotRowHeaderHighlight';
    }

    return 'pivotRowHeader';
  };

  var getRowLine = function getRowLine(row, i) {
    var headerItems = (0, _lodash.default)(row, function (x) {
      return x.type === 'header';
    });
    var popOverDataArray = getPopOverDataArray(headerItems, row);
    var rowItems = headerItems.map(function (item, y) {
      return item.visible ? /*#__PURE__*/_react.default.createElement("th", {
        key: "th-".concat(i, "-").concat(y),
        rowSpan: item.rowSpan,
        className: getHeaderClassName(item.value)
      }, getItemValue(y, item.value)) : null;
    }).filter(function (x) {
      return x;
    });

    var _getValuesObj = getValuesObj(row),
        valuesObj = _getValuesObj.valuesObj,
        valuesCols = _getValuesObj.valuesCols;

    rowItems.push( /*#__PURE__*/_react.default.createElement("td", {
      key: "bar-".concat(i),
      className: "bar"
    }, getBarChart(valuesObj, valuesCols, popOverDataArray)));
    return rowItems.filter(function (x) {
      return x;
    });
  };

  var getRows = function getRows() {
    return /*#__PURE__*/_react.default.createElement("tbody", null, getSlicedRows(pivotRows).map(function (row, i) {
      return /*#__PURE__*/_react.default.createElement("tr", {
        key: "row-".concat(i)
      }, getRowLine(row, i));
    }));
  };

  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("table", {
    className: tableClassName || 'simple-pivot-table',
    style: {
      width: width,
      height: height,
      maxWidth: maxWidth,
      maxHeight: maxHeight
    }
  }, cols && getHeader(), cols && pivotRows && getRows()));
}

PivotTableBarChart.propTypes = {
  barLegendFormatter: _propTypes.default.func,
  barLegendSteps: _propTypes.default.number,
  barType: _propTypes.default.string,
  barsHeight: _propTypes.default.number,
  barsMaxValue: _propTypes.default.number,
  barsMinValue: _propTypes.default.number,
  columnsLabels: _propTypes.default.array,
  colors: _propTypes.default.array,
  data: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.array]),
  filters: _propTypes.default.array,
  height: _propTypes.default.string,
  hideColumns: _propTypes.default.array,
  highlightRows: _propTypes.default.array,
  multiStackSplit: _propTypes.default.number,
  maxHeight: _propTypes.default.string,
  maxWidth: _propTypes.default.string,
  orderBy: _propTypes.default.array,
  popOverFormatter: _propTypes.default.func,
  popOverFunction: _propTypes.default.func,
  postprocessfn: _propTypes.default.func,
  rows: _propTypes.default.array,
  rowsLimit: _propTypes.default.number,
  showPopOver: _propTypes.default.bool,
  tableClassName: _propTypes.default.string,
  values: _propTypes.default.array,
  width: _propTypes.default.string
};