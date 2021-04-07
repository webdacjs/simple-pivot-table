import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import soa from 'sort-objects-array'

export default function Table ({ data, filters, columns, columnsLabels, width, height }) {
  const [cols, setCols] = useState()
  const [rows, setRows] = useState()
  const [asc, setAsc] = useState()

  function orderByColumn (col) {
    setRows()
    const direction = asc ? undefined : 'desc'
    const sortedData = soa(data, col, direction)
    setRows(sortedData)
    setAsc(!asc)
  }

  useEffect(() => {
    setCols(columns || Object.keys(data[0]))
    setRows(data)
    setAsc(true)
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
          <th key={`col-${i}`} onClick={() => orderByColumn(col)}>
            {getColumnLabel(col, i)}
          </th>)}
      </tr>
    </thead>

  const getRows = () =>
    <tbody>
      {getFilteredRows(rows).map((row, i) =>
        <tr key={`row-${i}`}>
          {cols.map((col, j) => <td key={`cell-${i}-${j}`}>{row[col]}</td>)}
        </tr>)}
    </tbody>

  return (
    <div>
      <table className='table table-sortable' style={{ width, height }}>
        {cols && getHeader()}
        {cols && rows && getRows()}
      </table>
    </div>

  )
}

Table.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  columnsLabels: PropTypes.array,
  filters: PropTypes.array,
  height: PropTypes.number,
  width: PropTypes.number
}
