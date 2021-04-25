import React from 'react'

import PivotTable from './index'
import './index.css'

import testData from '../../testData/'

export default {
  title: 'PivotTable',
  component: PivotTable
}

const Template = ({
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
}) =>
  <PivotTable
    data={data}
    columns={columns}
    rows={rows}
    columnsLabels={columnsLabels}
    filters={filters}
    height={height}
    values={values}
    width={width}
    postprocessfn={postprocessfn}
    showColumnTotals={showColumnTotals}
    showRowsTotals={showRowsTotals}
  />

export const Default = Template.bind({})
Default.args = {
  data: testData,
  rows: ['continent', 'country'],
  showColumnTotals: true,
  values: [
    { field: 'population', aggregator: 'sum' }
  ]
}

export const ColumnLabelsAndFormatters = Template.bind({})
ColumnLabelsAndFormatters.args = {
  data: testData,
  rows: ['continent', 'currency_code', 'government', 'country'],
  columnsLabels: ['Continent', 'Currency', 'Government', 'Country', 'Population Sum', 'Count'],
  values: [
    {
      field: 'population',
      aggregator: 'sum',
      formatter: x => Math.round(x).toLocaleString()
    },
    { field: 'area' }
  ]
}

export const SumAggregatorCastingStr = Template.bind({})
SumAggregatorCastingStr.args = {
  data: testData.map(x => ({...x, population: String(x.population)})),
  rows: ['continent'],
  columnsLabels: ['Continent', 'Population Avg'],
  values: [
    {
      field: 'population',
      aggregator: 'sum',
      formatter: x => Math.round(x).toLocaleString()
    }
  ]
}

export const AverageAggregator = Template.bind({})
AverageAggregator.args = {
  data: testData,
  rows: ['continent'],
  columnsLabels: ['Continent', 'Population Avg'],
  values: [
    {
      field: 'population',
      aggregator: 'avg',
      formatter: x => Math.round(x).toLocaleString()
    }
  ]
}

export const MedianAggregator = Template.bind({})
MedianAggregator.args = {
  data: testData,
  rows: ['continent'],
  columnsLabels: ['Continent', 'Population Avg'],
  values: [
    {
      field: 'population',
      aggregator: 'median',
      formatter: x => Math.round(x).toLocaleString()
    }
  ]
}

export const CountAggregator = Template.bind({})
CountAggregator.args = {
  data: testData,
  rows: ['continent'],
  columnsLabels: ['Continent', 'Country Count'],
  showColumnTotals: true,
  values: [
    {
      field: 'country'
    }
  ]
}

export const CustomFormatters = Template.bind({})
CustomFormatters.args = {
  data: testData,
  rows: ['continent', 'country'],
  columnsLabels: ['Continent', 'country', 'Population Sum', 'Area Sum'],
  showColumnTotals: true,
  values: [
    {
      field: 'population',
      aggregator: 'sum',
      formatter: x => `${parseFloat(x / 1000000).toFixed(2)} M. hab.`
    },
    {
      field: 'area',
      aggregator: 'sum',
      formatter: x => `${Math.round(x).toLocaleString()} km²`
    }
  ]
}

export const PostProcessFunction = Template.bind({})
PostProcessFunction.args = {
  data: testData,
  rows: ['continent'],
  columnsLabels: ['Continent', 'Country Count', 'Custom Field'],
  showColumnTotals: true,
  postprocessfn: result => {
    return {
      country: result.country,
      custom_field: 10
    }
  },
  values: [
    {
      field: 'country'
    }
  ]
}
