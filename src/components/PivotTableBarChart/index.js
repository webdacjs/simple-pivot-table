import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import filter from 'lodash.filter'

import getGroupedData from '../utils/getGrouped'
import getDenormalized from '../utils/getDenormalized'
import { getColumns, getFilteredRows } from '../utils/pivotCommon'
import { separator } from '../utils/settings'

import GaugeChart from '../BarCharts/GaugeChart'
import D3Header from '../BarCharts/D3Header'
import getLinearScale from '../BarCharts/d3getLinearScale'

import PopOver from '../PopOver/'

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
  showPopOver,
  popOverFormatter,
  width,
  values,
  height,
  postprocessfn,
  totalsUnformatters
}) {
  const [cols, setCols] = useState()
  const [pivotRows, setRows] = useState()
  const [groupedDataState, setGroupedDataState] = useState()
  const [colsTotals, setColsTotals] = useState()

  useEffect(() => {
    const groupedData = getGroupedData({
      data: getFilteredRows(data, filters),
      rowAttributes: rows,
      vals: values,
      postprocessfn,
      getOriginalsFlag: true,
      totalsUnformatters
    })
    setColsTotals(groupedData.valueTotals)
    setGroupedDataState(groupedData.groupedOriginals)
    const denormalizedData = getDenormalized(groupedData)
    setCols(getColumns(columnsLabels, rows, values))
    setRows(denormalizedData)
    getLinearScale(0, 100, 15)
  }, [data, rows, values, columnsLabels]) // eslint-disable-line

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

  function getBarChart (valuesObj, valuesCols, dataArray) {
    if (barType === 'gauge') {
      return (
        <PopOver showPopOver={showPopOver} dataArray={dataArray}>
          <GaugeChart
            dataElement={valuesObj}
            dimensions={valuesCols}
            height={barsHeight}
            minValue={barsMinValue}
            maxValue={barsMaxValue}
          />
        </PopOver>
      )
    }
  }

  const getPopOverDataArray = headerItems => {
    if (!showPopOver) {
      return []
    }
    const rowKey = headerItems.map(x => x.value).join(separator)
    const originalValue = groupedDataState[rowKey]
    const dataArray = []
    headerItems.forEach((item, i) => {
      dataArray.push({ key: rows[i], value: item.value })
    })
    Object.keys(originalValue).forEach(key => {
      const item = originalValue[key]
      dataArray.push({ key, value: popOverFormatter ? popOverFormatter(item) : item })
    })
    return dataArray
  }

  const getRowLine = (row, i) => {
    const headerItems = filter(row, x => x.type === 'header')
    const popOverDataArray = getPopOverDataArray(headerItems)
    const rowItems = headerItems.map(
      (item, y) => item.visible
        ? <th key={`th-${i}-${y}`} rowSpan={item.rowSpan} className='pivotRowHeader'>{item.value}</th>
        : null).filter(x => x)
    const { valuesObj, valuesCols } = getValuesObj(row)
    rowItems.push(
      <td key={`bar-${i}`} className='bar'>
        {getBarChart(valuesObj, valuesCols, popOverDataArray)}
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
      <table className='simple-pivot-table' style={{ width, height }}>
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
  showPopOver: PropTypes.bool,
  popOverFormatter: PropTypes.func,
  values: PropTypes.array,
  filters: PropTypes.array,
  height: PropTypes.number,
  postprocessfn: PropTypes.func,
  width: PropTypes.number
}
