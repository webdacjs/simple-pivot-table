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
  showSectionTotals,
  calculateSectionPercentage,
  calculateTotalsPercentage,
  getTree,
  orderBy,
  showRanking
}) {
  const groupedData = getGroupedData(
    {
      data: getFilteredRows(data, filters),
      rowAttributes: rows,
      vals: values,
      postprocessfn,
      getOriginalsFlag: getOriginals,
      showSectionTotals,
      calculateSectionPercentage,
      calculateTotalsPercentage
    }
  )
  const colsTotals = groupedData.valueTotals
  const colsValues = getColumns(
    {columnsLabels, rows, values, calculateTotalsPercentage, calculateSectionPercentage, showRanking})
  const pivotData = getDenormalized(groupedData, rows, orderBy, showRanking)

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
  showColumnTotals,
  showSectionTotals
}) {
  const { pivotData, colsValues, colsTotals } = getPivotDataColumns({
    data,
    filters,
    rows,
    values,
    columnsLabels,
    postprocessfn,
    showSectionTotals
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
  showSectionTotals,
  calculateSectionPercentage,
  calculateTotalsPercentage,
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
      showColumnTotals,
      showSectionTotals,
      calculateSectionPercentage,
      calculateTotalsPercentage
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
    showColumnTotals,
    showSectionTotals,
    calculateSectionPercentage,
    calculateTotalsPercentage,
    getTree
  })
  return tree
}
