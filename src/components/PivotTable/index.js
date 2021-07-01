import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import getPivotDataColumns from '../utils/pivotMain'

export default function PivotTable ({
  columnsLabels,
  data,
  filters,
  height,
  maxHeight,
  maxWidth,
  orderBy,
  postprocessfn,
  rows,
  rowsLimit,
  showColumnTotals,
  showRowsTotals,
  showSectionTotals,
  showRanking,
  calculateSectionPercentage,
  calculateTotalsPercentage,
  tableClassName,
  values,
  width
}) {
  const [cols, setCols] = useState()
  const [pivotRows, setRows] = useState()
  const [colsTotals, setColsTotals] = useState()
  const [selectedRow, setSelectedRow] = useState()

  const getSlicedRows = rows => rowsLimit ? rows.slice(0, rowsLimit) : rows

  useEffect(() => {
    const { pivotData, colsValues, colsTotals } = getPivotDataColumns({
      data,
      filters,
      rows,
      values,
      columnsLabels,
      orderBy,
      showRanking,
      postprocessfn,
      showSectionTotals,
      calculateSectionPercentage,
      calculateTotalsPercentage
    })
    setColsTotals(colsTotals)
    setCols(colsValues)
    setRows(pivotData)
  }, [data, rows, values, columnsLabels]) // eslint-disable-line

  const getRowClassName = rowid => rowid === selectedRow ? 'selected' : null

  const setSelectedRowFn = rowid => {
    if (rowid !== selectedRow) {
      setSelectedRow(rowid)
      return
    }
    setSelectedRow()
  }

  const getColumnLabel = (col, i) =>
    columnsLabels && columnsLabels[i] ? columnsLabels[i] : col

  const getColsLength = () => showRanking
    ? rows.length + 1
    : rows.length

  const getHeader = () =>
    <thead>
      <tr>
        {cols.slice(0, getColsLength()).map((col, i) =>
          <th key={`col-${i}`} className='pivotHeader'>
            {getColumnLabel(col, i)}
          </th>)}
        {cols.slice(getColsLength(), 100).map((col, i) =>
          <th key={`col-${i + rows.length}`} className='pivotHeaderValue'>
            {getColumnLabel(col, i + rows.length)}
          </th>)}
      </tr>
    </thead>

  const getLineClass = (baseClass, item) => item.totalsLine ? `${baseClass} pivotSubtotal` : baseClass

  const getRowLine = (row, i) => {
    const rowItems = row.map((item, y) => {
      if (item.type === 'header' && item.visible) {
        return <th key={`th-${i}-${y}`} rowSpan={item.rowSpan} className={getLineClass('pivotRowHeader', item)}>{item.value}</th>
      } else if (item.type === 'value') {
        return <td key={`td-${i}-${y}`} className={getLineClass('pivotValue', item)}>{item.value}</td>
      }
    })
    return rowItems.filter(x => x)
  }

  const getColumnTotalsRow = () =>
    <tr>
      <th key='th-totals-col' colSpan={rows.length} className='pivotRowHeaderTotal'>Totals:</th>
      {Object.keys(colsTotals).map((item, i) =>
        <td key={`td-totals-td-${i}`} className='pivotRowValueTotal'>{colsTotals[item]}</td>)}
    </tr>

  const getRows = () =>
    <tbody>
      {getSlicedRows(pivotRows).map((row, i) =>
        <tr
          key={`row-${i}`}
          className={getRowClassName(`row-${i}`)}
          onClick={() => setSelectedRowFn(`row-${i}`)}
        >
          {getRowLine(row, i)}
        </tr>)}
      {showColumnTotals && getColumnTotalsRow()}
    </tbody>

  return (
    <div>
      <table className={tableClassName || 'simple-pivot-table'} style={{ width, height, maxWidth, maxHeight }}>
        {cols && getHeader()}
        {cols && pivotRows && getRows()}
      </table>
    </div>
  )
}

PivotTable.propTypes = {
  columnsLabels: PropTypes.array,
  data: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]),
  filters: PropTypes.array,
  height: PropTypes.string,
  maxHeight: PropTypes.string,
  maxWidth: PropTypes.string,
  orderBy: PropTypes.array,
  postprocessfn: PropTypes.func,
  rows: PropTypes.array,
  rowsLimit: PropTypes.number,
  showColumnTotals: PropTypes.bool,
  showRowsTotals: PropTypes.bool,
  showSectionTotals: PropTypes.bool,
  showRanking: PropTypes.bool,
  calculateSectionPercentage: PropTypes.bool,
  calculateTotalsPercentage: PropTypes.bool,
  tableClassName: PropTypes.string,
  values: PropTypes.array,
  width: PropTypes.string
}
