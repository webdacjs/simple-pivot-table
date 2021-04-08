import React from 'react'

import PivotTableBarChart from './index'
import './index.css'

import testData from '../../testData/'

export default {
  title: 'PivotTableBarChart',
  component: PivotTableBarChart
}

const Template = ({
  data,
  filters,
  rows,
  columns,
  columnsLabels,
  barLegendSteps,
  barLegendFormatter,
  barType,
  barsMinValue,
  barsMaxValue,
  barsHeight,
  width,
  values,
  height,
  postprocessfn
}) =>
  <PivotTableBarChart
    data={data}
    columns={columns}
    rows={rows}
    columnsLabels={columnsLabels}
    barType={barType}
    barLegendSteps={barLegendSteps}
    barLegendFormatter={barLegendFormatter}
    filters={filters}
    height={height}
    barsMinValue={barsMinValue}
    barsMaxValue={barsMaxValue}
    barsHeight={barsHeight}
    values={values}
    width={width}
    postprocessfn={postprocessfn}
  />

export const Default = Template.bind({})
Default.args = {
  data: testData,
  rows: ['continent', 'country'],
  // China population
  barsMaxValue: 1443622060,
  barLegendSteps: 5,
  values: [
    { field: 'population', aggregator: 'sum' }
  ]
}

export const TwoDimensions = Template.bind({})
TwoDimensions.args = {
  data: testData,
  rows: ['continent', 'currency_code', 'government', 'country'],
  columnsLabels: ['Continent', 'Currency', 'Government', 'Country', 'Population Sum', 'Count'],
  postprocessfn: result => {
    return {
      population: 100,
      area: Math.round((result.population * 100) / (result.area || 1) / 1000)
    }
  },
  values: [
    {
      field: 'population',
      aggregator: 'sum'
    },
    {
      field: 'area',
      aggregator: 'sum'
    }
  ]
}
