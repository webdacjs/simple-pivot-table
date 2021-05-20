"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getPivotDataColumns;
exports.getPivotCsvData = getPivotCsvData;
exports.getPivotJsonData = getPivotJsonData;

var _pivotCommon = require("./pivotCommon");

var _getGrouped = _interopRequireDefault(require("./getGrouped"));

var _getDenormalized = _interopRequireDefault(require("./getDenormalized"));

var _getFullTree = _interopRequireDefault(require("./getFullTree"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getPivotDataColumns(_ref) {
  var data = _ref.data,
      filters = _ref.filters,
      rows = _ref.rows,
      values = _ref.values,
      columnsLabels = _ref.columnsLabels,
      postprocessfn = _ref.postprocessfn,
      getOriginals = _ref.getOriginals,
      showSectionTotals = _ref.showSectionTotals,
      calculateSectionPercentage = _ref.calculateSectionPercentage,
      calculateTotalsPercentage = _ref.calculateTotalsPercentage,
      getTree = _ref.getTree,
      orderBy = _ref.orderBy;
  var groupedData = (0, _getGrouped.default)({
    data: (0, _pivotCommon.getFilteredRows)(data, filters),
    rowAttributes: rows,
    vals: values,
    postprocessfn: postprocessfn,
    getOriginalsFlag: getOriginals,
    showSectionTotals: showSectionTotals,
    calculateSectionPercentage: calculateSectionPercentage,
    calculateTotalsPercentage: calculateTotalsPercentage
  });
  var colsTotals = groupedData.valueTotals;
  var colsValues = (0, _pivotCommon.getColumns)(columnsLabels, rows, values, calculateTotalsPercentage, calculateSectionPercentage);
  var pivotData = (0, _getDenormalized.default)(groupedData, rows, orderBy);

  if (getOriginals) {
    var groupedOriginals = groupedData.groupedOriginals;
    return {
      pivotData: pivotData,
      colsValues: colsValues,
      colsTotals: colsTotals,
      groupedOriginals: groupedOriginals
    };
  }

  if (getTree) {
    var tree = (0, _getFullTree.default)(groupedData);
    return tree;
  }

  return {
    pivotData: pivotData,
    colsValues: colsValues,
    colsTotals: colsTotals
  };
}

function getPivotCsvData(_ref2) {
  var data = _ref2.data,
      filters = _ref2.filters,
      rows = _ref2.rows,
      values = _ref2.values,
      columnsLabels = _ref2.columnsLabels,
      postprocessfn = _ref2.postprocessfn,
      showColumnTotals = _ref2.showColumnTotals,
      showSectionTotals = _ref2.showSectionTotals;

  var _getPivotDataColumns = getPivotDataColumns({
    data: data,
    filters: filters,
    rows: rows,
    values: values,
    columnsLabels: columnsLabels,
    postprocessfn: postprocessfn,
    showSectionTotals: showSectionTotals
  }),
      pivotData = _getPivotDataColumns.pivotData,
      colsValues = _getPivotDataColumns.colsValues,
      colsTotals = _getPivotDataColumns.colsTotals;

  var csvData = (0, _pivotCommon.getCsvContents)(pivotData, colsValues, rows, showColumnTotals, colsTotals);
  return csvData;
}

function getPivotJsonData(_ref3) {
  var data = _ref3.data,
      filters = _ref3.filters,
      rows = _ref3.rows,
      values = _ref3.values,
      columnsLabels = _ref3.columnsLabels,
      postprocessfn = _ref3.postprocessfn,
      showColumnTotals = _ref3.showColumnTotals,
      showSectionTotals = _ref3.showSectionTotals,
      calculateSectionPercentage = _ref3.calculateSectionPercentage,
      calculateTotalsPercentage = _ref3.calculateTotalsPercentage,
      getTree = _ref3.getTree;

  if (!getTree) {
    var csvData = getPivotCsvData({
      data: data,
      filters: filters,
      rows: rows,
      values: values,
      columnsLabels: columnsLabels,
      postprocessfn: postprocessfn,
      showColumnTotals: showColumnTotals,
      showSectionTotals: showSectionTotals,
      calculateSectionPercentage: calculateSectionPercentage,
      calculateTotalsPercentage: calculateTotalsPercentage
    });
    var jsonData = (0, _pivotCommon.csvToJson)(csvData);
    return jsonData;
  }

  var tree = getPivotDataColumns({
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
  return tree;
}