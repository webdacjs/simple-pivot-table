import React from 'react'

import PivotTable from './index'
import './index.css'

import testData from '../../testData/'
import budget from '../../testData/budget.json'

export default {
  title: 'PivotTable',
  component: PivotTable
}

const Template = ({
  data,
  columns,
  rows,
  columnsLabels,
  filters,
  height,
  values,
  width
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
  />

export const Default = Template.bind({})
Default.args = {
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

export const ContinentCurrency = Template.bind({})
ContinentCurrency.args = {
  data: testData,
  rows: ['continent', 'currency_code'],
  columnsLabels: ['Continent', 'Currency', 'Population Sum'],
  values: [
    {
      field: 'population',
      aggregator: 'sum',
      formatter: x => Math.round(x).toLocaleString()
    }
  ]
}

export const PopulationContinent = Template.bind({})
PopulationContinent.args = {
  data: testData,
  rows: ['continent'],
  columnsLabels: ['Continent', 'Population Sum'],
  values: [
    {
      field: 'population',
      aggregator: 'sum',
      formatter: x => Math.round(x).toLocaleString()
    }
  ]
}

export const PopulationAreaContinent = Template.bind({})
PopulationAreaContinent.args = {
  data: testData,
  rows: ['continent', 'country'],
  columnsLabels: ['Continent', 'country', 'Population Sum', 'Area Sum'],
  values: [
    {
      field: 'population',
      aggregator: 'sum',
      formatter: x => Math.round(x).toLocaleString()
    },
    {
      field: 'area',
      aggregator: 'sum',
      formatter: x => `${Math.round(x).toLocaleString()} km²`
    }
  ]
}
