"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = PivotTableBarChart;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = _interopRequireDefault(require("lodash.filter"));

var _getGrouped = _interopRequireDefault(require("../utils/getGrouped"));

var _getDenormalized = _interopRequireDefault(require("../utils/getDenormalized"));

var _pivotCommon = require("../utils/pivotCommon");

var _settings = require("../utils/settings");

var _GaugeChart = _interopRequireDefault(require("../BarCharts/GaugeChart"));

var _D3Header = _interopRequireDefault(require("../BarCharts/D3Header"));

var _d3getLinearScale = _interopRequireDefault(require("../BarCharts/d3getLinearScale"));

var _PopOver = _interopRequireDefault(require("../PopOver/"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function PivotTableBarChart(_ref) {
  var data = _ref.data,
      filters = _ref.filters,
      rows = _ref.rows,
      columns = _ref.columns,
      columnsLabels = _ref.columnsLabels,
      _ref$barsMinValue = _ref.barsMinValue,
      barsMinValue = _ref$barsMinValue === void 0 ? 0 : _ref$barsMinValue,
      _ref$barsMaxValue = _ref.barsMaxValue,
      barsMaxValue = _ref$barsMaxValue === void 0 ? 100 : _ref$barsMaxValue,
      _ref$barLegendSteps = _ref.barLegendSteps,
      barLegendSteps = _ref$barLegendSteps === void 0 ? 10 : _ref$barLegendSteps,
      _ref$barsHeight = _ref.barsHeight,
      barsHeight = _ref$barsHeight === void 0 ? 15 : _ref$barsHeight,
      _ref$barType = _ref.barType,
      barType = _ref$barType === void 0 ? 'gauge' : _ref$barType,
      barLegendFormatter = _ref.barLegendFormatter,
      showPopOver = _ref.showPopOver,
      popOverFormatter = _ref.popOverFormatter,
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

  var _useState5 = (0, _react.useState)(),
      _useState6 = _slicedToArray(_useState5, 2),
      groupedDataState = _useState6[0],
      setGroupedDataState = _useState6[1];

  var _useState7 = (0, _react.useState)(),
      _useState8 = _slicedToArray(_useState7, 2),
      colsTotals = _useState8[0],
      setColsTotals = _useState8[1];

  (0, _react.useEffect)(function () {
    var groupedData = (0, _getGrouped.default)((0, _pivotCommon.getFilteredRows)(data, filters), rows, values, postprocessfn, true);
    setColsTotals(groupedData.valueTotals);
    setGroupedDataState(groupedData.groupedOriginals);
    var denormalizedData = (0, _getDenormalized.default)(groupedData);
    setCols((0, _pivotCommon.getColumns)(columnsLabels, rows, values));
    setRows(denormalizedData);
    (0, _d3getLinearScale.default)(0, 100, 15);
  }, [data]); // eslint-disable-line

  var getColumnLabel = function getColumnLabel(col, i) {
    return columnsLabels && columnsLabels[i] ? columnsLabels[i] : col;
  };

  var getHeader = function getHeader() {
    return /*#__PURE__*/_react.default.createElement("thead", null, /*#__PURE__*/_react.default.createElement("tr", null, cols.slice(0, rows.length).map(function (col, i) {
      return /*#__PURE__*/_react.default.createElement("th", {
        key: "col-".concat(i),
        className: "pivotHeader"
      }, getColumnLabel(col, i));
    }), /*#__PURE__*/_react.default.createElement("th", {
      key: "bar-header",
      className: "bar-header"
    }, /*#__PURE__*/_react.default.createElement(_D3Header.default, {
      height: barsHeight,
      legendValues: (0, _d3getLinearScale.default)(barsMinValue, barsMaxValue, barLegendSteps, barLegendFormatter)
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
        minValue: barsMinValue,
        maxValue: barsMaxValue
      }));
    }
  }

  var getPopOverDataArray = function getPopOverDataArray(headerItems) {
    if (!showPopOver) {
      return [];
    }

    var rowKey = headerItems.map(function (x) {
      return x.value;
    }).join(_settings.separator);
    var originalValue = groupedDataState[rowKey];
    var dataArray = [];
    headerItems.forEach(function (item, i) {
      dataArray.push({
        key: rows[i],
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

  var getRowLine = function getRowLine(row, i) {
    var headerItems = (0, _lodash.default)(row, function (x) {
      return x.type === 'header';
    }).map(function (x) {
      return {
        value: x.value,
        visible: x.visible
      };
    });
    var popOverDataArray = getPopOverDataArray(headerItems);
    var rowItems = headerItems.map(function (item, y) {
      return /*#__PURE__*/_react.default.createElement("th", {
        key: "th-".concat(i, "-").concat(y),
        rowspan: item.rowSpan,
        className: "pivotRowHeader"
      }, item.value);
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
    return /*#__PURE__*/_react.default.createElement("tbody", null, pivotRows.map(function (row, i) {
      return /*#__PURE__*/_react.default.createElement("tr", {
        key: "row-".concat(i)
      }, getRowLine(row, i));
    }));
  };

  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("table", {
    className: "simple-pivot-table",
    style: {
      width: width,
      height: height
    }
  }, cols && getHeader(), cols && pivotRows && getRows()));
}

PivotTableBarChart.propTypes = {
  data: _propTypes.default.array,
  rows: _propTypes.default.array,
  columns: _propTypes.default.array,
  columnsLabels: _propTypes.default.array,
  barType: _propTypes.default.string,
  barLegendFormatter: _propTypes.default.func,
  barLegendSteps: _propTypes.default.number,
  barsHeight: _propTypes.default.number,
  barsMinValue: _propTypes.default.number,
  barsMaxValue: _propTypes.default.number,
  showPopOver: _propTypes.default.bool,
  popOverFormatter: _propTypes.default.func,
  values: _propTypes.default.array,
  filters: _propTypes.default.array,
  height: _propTypes.default.number,
  postprocessfn: _propTypes.default.func,
  width: _propTypes.default.number
};