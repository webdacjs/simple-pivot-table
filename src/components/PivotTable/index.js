import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import getGroupedData from './getGrouped'
import getDenormalized from './getDenormalized'

export default function PivotTable ({ data, filters, rows, columns, columnsLabels, width, values, height }) {
  const [cols, setCols] = useState()
  const [pivotRows, setRows] = useState()

  function getColumns () {
    if (columnsLabels) {
      return columnsLabels
    }
    return [...rows, ...values.map(x => x.field)]
  }

  useEffect(() => {
    const groupedData = getGroupedData(
      getFilteredRows(data), rows, values)
    const denormalizedData = getDenormalized(groupedData, rows, values)
    setCols(getColumns())
    setRows(denormalizedData)
  }, []) // eslint-disable-line

  function filterIterations (rawRows) {
    let filteredRows = [...rawRows]
    filters.forEach(filterFn => {
      filteredRows = filteredRows.filter(filterFn)
    })
    return filteredRows
  }

  const getFilteredRows = rawRows => filters
    ? filterIterations(rawRows)
    : rawRows

  const getColumnLabel = (col, i) =>
    columnsLabels && columnsLabels[i] ? columnsLabels[i] : col

  const getHeader = () =>
    <thead>
      <tr>
        {cols.map((col, i) =>
          <th key={`col-${i}`}>
            {getColumnLabel(col, i)}
          </th>)}
      </tr>
    </thead>

  const getRowLine = (row, i) => {
    const rowItems = row.map((item, y) => {
      if (item.type === 'header' && item.visible) {
        return <th key={`th-${i}-${y}`} rowspan={item.rowSpan}>{item.value}</th>
      } else if (item.type === 'value') {
        return <td key={`td-${i}-${y}`}>{item.value}</td>
      }
    })
    return rowItems.filter(x => x)
  }

  const getRows = () =>
    <tbody>
      {pivotRows.map((row, i) =>
        <tr key={`row-${i}`}>
          {getRowLine(row, i)}
        </tr>)}
    </tbody>

  return (
    <div>
      <table className='table table-sortable' style={{ width, height }}>
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
  width: PropTypes.number
}
