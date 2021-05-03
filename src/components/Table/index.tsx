import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import soa from 'sort-objects-array'

export default function Table ({
  data,
  filters,
  columns,
  columnsLabels,
  maxWidth,
  width,
  maxHeight,
  height
}) {
  const [cols, setCols] = useState(null)
  const [rows, setRows] = useState(null)
  const [asc, setAsc] = useState(null)

  function orderByColumn (col: string) {
    setRows(undefined)
    const direction = asc ? undefined : 'desc'
    const sortedData = soa(data, col, direction)
    setRows(sortedData)
    setAsc(!asc)
  }

  useEffect(() => {
    setCols(columns || Object.keys(data[0]))
    setRows(data)
    setAsc(true)
  }, [data, columns, columnsLabels]); // eslint-disable-line

  function filterIterations (rawRows: Array<object>) {
    let filteredRows = [...rawRows]
    filters.forEach(filterFn => {
      filteredRows = filteredRows.filter(filterFn)
    })
    return filteredRows
  }

  const getFilteredRows = (rawRows: Array<object>) => filters
    ? filterIterations(rawRows)
    : rawRows

  const getColumnLabel = (col: string, i: number) =>
    columnsLabels && columnsLabels[i] ? columnsLabels[i] : col

  const getHeader = () =>
    <thead>
      <tr>
        {cols.map((col: string, i: number) =>
          <th key={`col-${i}`} onClick={() => orderByColumn(col)}>
            {getColumnLabel(col, i)}
          </th>)}
      </tr>
    </thead>

  const getRows = () =>
    <tbody>
      {getFilteredRows(rows).map((row, i) =>
        <tr key={`row-${i}`}>
          {cols.map((col: string, j: number) => <td key={`cell-${i}-${j}`}>{row[col]}</td>)}
        </tr>)}
    </tbody>

  return (
    <div>
      <table className='simple-table' style={{ width, height, maxWidth, maxHeight }}>
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
  height: PropTypes.string,
  maxHeight: PropTypes.string,
  maxWidth: PropTypes.string,
  width: PropTypes.string
}
