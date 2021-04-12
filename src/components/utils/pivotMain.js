import {
  getColumns,
  getFilteredRows,
  getCsvContents,
  csvToJson
} from './pivotCommon'
import getGroupedData from './getGrouped'
import getDenormalized from './getDenormalized'

export default function getPivotDataColumns ({
  data,
  filters,
  rows,
  values,
  columnsLabels,
  postprocessfn
}) {
  const groupedData = getGroupedData(
    getFilteredRows(data, filters), rows, values, postprocessfn)
  const colsTotals = groupedData.valueTotals
  const colsValues = getColumns(columnsLabels, rows, values)
  const pivotData = getDenormalized(groupedData)

  return { pivotData, colsValues, colsTotals }
}

export function getCsvData ({
  data,
  filters,
  rows,
  values,
  columnsLabels,
  postprocessfn,
  showColumnTotals
}) {
  const { pivotData, colsValues, colsTotals } = getPivotDataColumns({
    data,
    filters,
    rows,
    values,
    columnsLabels,
    postprocessfn
  })
  const csvData = getCsvContents(
    pivotData, colsValues, rows, showColumnTotals, colsTotals)
  return csvData
}

export function getJsonData ({
  data,
  filters,
  rows,
  values,
  columnsLabels,
  postprocessfn,
  showColumnTotals
}) {
  const csvData = getCsvData({
    data,
    filters,
    rows,
    values,
    columnsLabels,
    postprocessfn,
    showColumnTotals
  })
  const jsonData = csvToJson(csvData)
  return jsonData
}
