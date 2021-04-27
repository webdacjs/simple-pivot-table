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
      sectionTotals = _ref.sectionTotals,
      getTree = _ref.getTree;
  var groupedData = (0, _getGrouped.default)((0, _pivotCommon.getFilteredRows)(data, filters), rows, values, postprocessfn, getOriginals, sectionTotals);
  var colsTotals = groupedData.valueTotals;
  var colsValues = (0, _pivotCommon.getColumns)(columnsLabels, rows, values);
  var pivotData = (0, _getDenormalized.default)(groupedData);

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
      sectionTotals = _ref2.sectionTotals;

  var _getPivotDataColumns = getPivotDataColumns({
    data: data,
    filters: filters,
    rows: rows,
    values: values,
    columnsLabels: columnsLabels,
    postprocessfn: postprocessfn,
    sectionTotals: sectionTotals
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
      sectionTotals = _ref3.sectionTotals,
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
      sectionTotals: sectionTotals
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
    sectionTotals: sectionTotals,
    getTree: getTree
  });
  return tree;
}