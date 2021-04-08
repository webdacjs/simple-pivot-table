import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import filter from 'lodash.filter'

import getGroupedData from '../utils/getGrouped'
import getDenormalized from '../utils/getDenormalized'
import { getColumns, getFilteredRows } from '../utils/pivotCommon'

import GaugeChart from '../BarCharts/GaugeChart'
import D3Header from '../BarCharts/D3Header'
import getLinearScale from '../BarCharts/d3getLinearScale'

export default function PivotTableBarChart ({
  data,
  filters,
  rows,
  columns,
  columnsLabels,
  barsMinValue = 0,
  barsMaxValue = 100,
  barLegendSteps = 10,
  barsHeight = 15,
  barType = 'gauge',
  barLegendFormatter,
  width,
  values,
  height,
  postprocessfn
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
    getLinearScale(0, 100, 15)
  }, [data]) // eslint-disable-line

  const getColumnLabel = (col, i) =>
    columnsLabels && columnsLabels[i] ? columnsLabels[i] : col

  const getHeader = () =>
    <thead>
      <tr>
        {cols.slice(0, rows.length).map((col, i) =>
          <th key={`col-${i}`} className='pivotHeader'>
            {getColumnLabel(col, i)}
          </th>)}
        <th key='bar-header' className='bar-header'>
          <D3Header
            height={barsHeight}
            legendValues={getLinearScale(barsMinValue, barsMaxValue, barLegendSteps, barLegendFormatter)}
          />
        </th>
      </tr>
    </thead>

  const getValuesObj = (row) => {
    const values = filter(row, x => x.type === 'value').map(x => x.value)
    const valuesCols = cols.slice(rows.length, 100)
    const valuesObj = values.reduce((obj, val, i) => { obj[valuesCols[i]] = val; return obj }, {})
    return { valuesObj, valuesCols }
  }

  function getBarChart (valuesObj, valuesCols) {
    if (barType === 'gauge') {
      return (
        <GaugeChart
          dataElement={valuesObj}
          dimensions={valuesCols}
          height={barsHeight}
          minValue={barsMinValue}
          maxValue={barsMaxValue}
        />
      )
    }
  }

  const getRowLine = (row, i) => {
    const rowItems = row.map((item, y) => {
      if (item.type === 'header' && item.visible) {
        return <th key={`th-${i}-${y}`} rowspan={item.rowSpan} className='pivotRowHeader'>{item.value}</th>
      }
    }).filter(x => x)
    const { valuesObj, valuesCols } = getValuesObj(row)
    rowItems.push(
      <td key={`bar-${i}`} className='bar'>
        {getBarChart(valuesObj, valuesCols)}
      </td>
    )
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
      <table className='table' style={{ width, height }}>
        {cols && getHeader()}
        {cols && pivotRows && getRows()}
      </table>
    </div>
  )
}

PivotTableBarChart.propTypes = {
  data: PropTypes.array,
  rows: PropTypes.array,
  columns: PropTypes.array,
  columnsLabels: PropTypes.array,
  barType: PropTypes.string,
  barLegendFormatter: PropTypes.func,
  barLegendSteps: PropTypes.number,
  barsHeight: PropTypes.number,
  barsMinValue: PropTypes.number,
  barsMaxValue: PropTypes.number,
  values: PropTypes.array,
  filters: PropTypes.array,
  height: PropTypes.number,
  postprocessfn: PropTypes.func,
  width: PropTypes.number
}
