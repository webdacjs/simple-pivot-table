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
  colors,
  barLegendSteps,
  barLegendFormatter,
  barType,
  barsMinValue,
  barsMaxValue,
  barsHeight,
  showPopOver,
  popOverFormatter,
  width,
  values,
  height,
  postprocessfn
}) =>
  <PivotTableBarChart
    data={data}
    columns={columns}
    colors={colors}
    rows={rows}
    columnsLabels={columnsLabels}
    barType={barType}
    barLegendSteps={barLegendSteps}
    barLegendFormatter={barLegendFormatter}
    filters={filters}
    height={height}
    barsMinValue={barsMinValue}
    barsMaxValue={barsMaxValue}
    showPopOver={showPopOver}
    popOverFormatter={popOverFormatter}
    barsHeight={barsHeight}
    values={values}
    width={width}
    postprocessfn={postprocessfn}
  />

const getRandomInt = max => Math.floor(Math.random() * max)

export const Default = Template.bind({})
Default.args = {
  data: testData,
  rows: ['continent', 'country'],
  showPopOver: true,
  popOverFormatter: x => `${Math.round(x).toLocaleString()} hab`,
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
  barLegendSteps: 10,
  barsMaxValue: 100,
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

export const StackChart = Template.bind({})
StackChart.args = {
  data: testData,
  rows: ['continent', 'currency_code', 'government', 'country'],
  columnsLabels: ['Continent', 'Currency', 'Government', 'Country', 'bar1', 'bar2', 'bar3', 'bar4'],
  colors: ['#4e79a7', '#e05759', '#59a14f', '#f28e2c'],
  barLegendSteps: 10,
  barsMaxValue: 100,
  barType: 'stack',
  postprocessfn: result => {
    return {
      bar1: getRandomInt(25),
      bar2: getRandomInt(25),
      bar3: getRandomInt(25),
      bar4: getRandomInt(25)
    }
  },
  values: [
    {
      field: 'population'
    }
  ]
}

export const MultiStackChart = Template.bind({})
MultiStackChart.args = {
  data: testData,
  rows: ['continent', 'currency_code', 'government', 'country'],
  columnsLabels: ['Continent', 'Currency', 'Government', 'Country', 'bar1', 'bar2', 'bar3', 'bar4'],
  colors: ['#4e79a7', '#e05759', '#59a14f', '#f28e2c'],
  barLegendSteps: 10,
  barsMaxValue: 100,
  barType: 'multistack',
  postprocessfn: result => {
    return {
      bar1: getRandomInt(25),
      bar2: getRandomInt(25),
      bar3: getRandomInt(25),
      bar4: getRandomInt(25)
    }
  },
  values: [
    {
      field: 'population'
    }
  ]
}
