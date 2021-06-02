import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import getPivotDataColumns from '../utils/pivotMain'
import getGroupedData from '../utils/getGrouped'

export default function ExperimentalPivotTable ({
  columnsLabels,
  columns,
  data,
  filters,
  height,
  maxHeight,
  maxWidth,
  orderBy,
  postprocessfn,
  rows,
  showColumnTotals,
  showRowsTotals,
  showSectionTotals,
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

  function postprocessfnLocal (reduced, items) {
    const { grouped } = getGroupedData({
      data: items,
      rowAttributes: columns.map(x => x.field),
      vals: values
    })

    const combinedKeysWithVals = values.map(x => x.field).reduce((obj, item) => {
      const combinedKeyPrefix = `${item}___`
      columns[0].allowedValues.map(value => {
        obj[`${combinedKeyPrefix}___${value}`] = (grouped[value] || { [value]: { [item]: '' } })[item]
      })
      return obj
    }, {})

    // Create New Return Object.
    return combinedKeysWithVals
  }

  const postprocessfnToUse = postprocessfn || postprocessfnLocal

  useEffect(() => {
    const { pivotData, colsValues, colsTotals } = getPivotDataColumns({
      data,
      filters,
      rows,
      values,
      columnsLabels,
      orderBy,
      postprocessfn: postprocessfnToUse,
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

  const getRootColumnLength = () =>
    columns[0].allowedValues.length * values.length

  const getHeader = () =>
    <thead>
      {columns && <>
        <tr>
          <th colspan={rows.length}>{' '}</th>
          <th colspan={getRootColumnLength()} style={{ textAlign: 'center' }}>{columns[0].label || columns[0].field}</th>
        </tr>
        <tr>
          <th colspan={rows.length}>{' '}</th>
          {values.map((x, i) =>
            <th style={{ textAlign: 'center' }} colspan={columns[0].allowedValues.length}>
              {x.label || x.field}
            </th>)}
        </tr>
      </>}
      <tr>
        {cols.slice(0, rows.length).map((col, i) =>
          <th key={`col-${i}`} className='pivotHeader'>
            {getColumnLabel(col, i)}
          </th>)}
        {!columns && cols.slice(rows.length, 100).map((col, i) =>
          <th key={`col-${i + rows.length}`} className='pivotHeaderValue'>
            {getColumnLabel(col, i + rows.length)}
          </th>)}
        {columns && values.map(() => columns[0].allowedValues.slice()).flat().map(
          (x, i) => <th key={`internal-${i}`} className='pivotHeaderValue pivotHeaderInternal' style={{ textAlign: 'center' }}>{x}</th>)}
      </tr>
    </thead>

  const getLineClass = (baseClass, item) => item.totalsLine ? `${baseClass} pivotSubtotal` : baseClass

  const getRowLine = (row, i) => {
    const rowItems = row.map((item, y) => {
      if (item.type === 'header' && item.visible) {
        return <th key={`th-${i}-${y}`} rowSpan={item.rowSpan} className={getLineClass('pivotRowHeader', item)}>{item.value}</th>
      } else if (item.type === 'value') {
        return <td key={`td-${i}-${y}`} className={getLineClass('pivotValue testValue', item)}>{item.value}</td>
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
      {pivotRows.map((row, i) =>
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

ExperimentalPivotTable.propTypes = {
  columnsLabels: PropTypes.array,
  columns: PropTypes.array,
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
  showColumnTotals: PropTypes.bool,
  showRowsTotals: PropTypes.bool,
  showSectionTotals: PropTypes.bool,
  calculateSectionPercentage: PropTypes.bool,
  calculateTotalsPercentage: PropTypes.bool,
  tableClassName: PropTypes.string,
  values: PropTypes.array,
  width: PropTypes.string
}
