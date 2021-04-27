import {
  getColumns,
  getFilteredRows,
  getCsvContents,
  csvToJson
} from './pivotCommon'
import getGroupedData from './getGrouped'
import getDenormalized from './getDenormalized'
import getFullTree from './getFullTree'

export default function getPivotDataColumns ({
  data,
  filters,
  rows,
  values,
  columnsLabels,
  postprocessfn,
  getOriginals,
  getTree
}) {
  const groupedData = getGroupedData(
    getFilteredRows(data, filters), rows, values, postprocessfn, getOriginals)
  const colsTotals = groupedData.valueTotals
  const colsValues = getColumns(columnsLabels, rows, values)
  const pivotData = getDenormalized(groupedData)

  if (getOriginals) {
    const { groupedOriginals } = groupedData
    return { pivotData, colsValues, colsTotals, groupedOriginals }
  }

  if (getTree) {
    const tree = getFullTree(groupedData)
    return tree
  }

  return { pivotData, colsValues, colsTotals }
}

export function getPivotCsvData ({
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

export function getPivotJsonData ({
  data,
  filters,
  rows,
  values,
  columnsLabels,
  postprocessfn,
  showColumnTotals,
  getTree
}) {
  if (!getTree) {
    const csvData = getPivotCsvData({
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
  const tree = getPivotDataColumns({
    data,
    filters,
    rows,
    values,
    columnsLabels,
    postprocessfn,
    getTree
  })
  return tree
}
