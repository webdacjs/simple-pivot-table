import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import getGroupedData from '../utils/getGrouped'
import getDenormalized from '../utils/getDenormalized'
import { getColumns, getFilteredRows } from '../utils/pivotCommon'

export default function PivotTable ({
  data,
  filters,
  rows,
  columns,
  columnsLabels,
  width,
  values,
  height,
  postprocessfn,
  showColumnTotals,
  showRowsTotals
}) {
  const [cols, setCols] = useState()
  const [pivotRows, setRows] = useState()
  const [colsTotals, setColsTotals] = useState()

  useEffect(() => {
    const groupedData = getGroupedData(
      getFilteredRows(data, filters), rows, values, postprocessfn)
    setColsTotals(groupedData.valueTotals)
    const denormalizedData = getDenormalized(groupedData)
    setCols(getColumns(columnsLabels, rows, values))
    setRows(denormalizedData)
  }, [data]) // eslint-disable-line

  const getColumnLabel = (col, i) =>
    columnsLabels && columnsLabels[i] ? columnsLabels[i] : col

  const getHeader = () =>
    <thead>
      <tr>
        {cols.map((col, i) =>
          <th key={`col-${i}`} className='pivotHeader'>
            {getColumnLabel(col, i)}
          </th>)}
      </tr>
    </thead>

  const getRowLine = (row, i) => {
    const rowItems = row.map((item, y) => {
      if (item.type === 'header' && item.visible) {
        return <th key={`th-${i}-${y}`} rowspan={item.rowSpan} className='pivotRowHeader'>{item.value}</th>
      } else if (item.type === 'value') {
        return <td key={`td-${i}-${y}`} className='pivotValue'>{item.value}</td>
      }
    })
    return rowItems.filter(x => x)
  }

  const getColumnTotalsRow = () =>
    <tr>
      <th key='th-totals-col' colspan={values.length} className='pivotRowHeaderTotal'>Totals:</th>
      {Object.keys(colsTotals).map(item =>
        <td className='pivotRowValueTotal'>{colsTotals[item]}</td>)}
    </tr>

  const getRows = () =>
    <tbody>
      {pivotRows.map((row, i) =>
        <tr key={`row-${i}`}>
          {getRowLine(row, i)}
        </tr>)}
      {showColumnTotals && getColumnTotalsRow()}
    </tbody>

  return (
    <div>
      <table className='table' style={{ width, height }}>
        {cols && getHeader()}
        {cols && pivotRows && getRows()}
      </table>
    </div>
  )
}

PivotTable.propTypes = {
  data: PropTypes.array,
  rows: PropTypes.array,
  columns: PropTypes.array,
  columnsLabels: PropTypes.array,
  values: PropTypes.array,
  filters: PropTypes.array,
  height: PropTypes.number,
  postprocessfn: PropTypes.func,
  showColumnTotals: PropTypes.bool,
  showRowsTotals: PropTypes.bool,
  width: PropTypes.number
}
