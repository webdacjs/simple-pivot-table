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
  hideColumns,
  highlightRows,
  showPopOver,
  orderBy,
  showRanking,
  popOverFormatter,
  popOverFunction,
  rowsLimit,
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
    hideColumns={hideColumns}
    highlightRows={highlightRows}
    barsMinValue={barsMinValue}
    barsMaxValue={barsMaxValue}
    showPopOver={showPopOver}
    orderBy={orderBy}
    showRanking={showRanking}
    rowsLimit={rowsLimit}
    popOverFormatter={popOverFormatter}
    popOverFunction={popOverFunction}
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

export const RowsLimit = Template.bind({})
RowsLimit.args = {
  data: testData,
  rows: ['country'],
  barLegendSteps: 5,
  rowsLimit: 10,
  orderBy: [
    { field: 'population', order: 'desc' }
  ],
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
  showPopOver: true,
  postprocessfn: result => {
    return {
      bar1: getRandomInt(25),
      bar2: getRandomInt(25),
      bar3: getRandomInt(25),
      bar4: getRandomInt(25)
    }
  },
  popOverFunction: thisrow => {
    const thisRowValues = thisrow.filter(x => x.type === 'value')
    const headerItems = ['Continent', 'Currency', 'Government', 'Country'].map((key, i) => ({
      key, value: thisrow[i].value
    }))
    const valueItems = ['Bar1', 'Bar2', 'Bar3', 'Bar4'].map((key, i) => ({
      key, value: thisRowValues[i].value
    }))
    return [
      ...headerItems,
      ...valueItems
    ]
  },
  values: [
    {
      field: 'population'
    }
  ]
}

export const OrderBarsByField = Template.bind({})
OrderBarsByField.args = {
  data: testData,
  columnsLabels: ['Continent', 'Country', 'Population', 'Area'],
  rows: ['continent', 'country'],
  orderBy: [
    { field: 'population', order: 'desc' },
    { field: 'area', order: 'desc' }
  ],
  barType: 'stack',
  showPopOver: true,
  barLegendSteps: 5,
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

export const OrderBarsByFieldWithRanking = Template.bind({})
OrderBarsByFieldWithRanking.args = {
  data: testData,
  columnsLabels: ['Continent', 'Rank', 'Country', 'Population', 'Area'],
  rows: ['continent', 'country'],
  orderBy: [
    { field: 'population', order: 'desc' },
    { field: 'area', order: 'desc' }
  ],
  barType: 'stack',
  showPopOver: true,
  showRanking: true,
  barLegendSteps: 5,
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

export const OrderBarsByFieldWithRankingHidingColumn = Template.bind({})
OrderBarsByFieldWithRankingHidingColumn.args = {
  data: testData,
  columnsLabels: ['Continent', 'Rank', '', 'Population', 'Area'],
  rows: ['continent', 'country'],
  orderBy: [
    { field: 'population', order: 'desc' },
    { field: 'area', order: 'desc' }
  ],
  hideColumns: [3],
  highlightRows: ['Ireland'],
  barType: 'stack',
  showPopOver: true,
  showRanking: true,
  barLegendSteps: 5,
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

export const OrderBarsByFieldCustomFunction = Template.bind({})
OrderBarsByFieldCustomFunction.args = {
  data: testData,
  rows: ['country'],
  orderBy: [
    { field: 'total', order: 'desc' }
  ],
  barType: 'stack',
  showPopOver: true,
  barLegendSteps: 5,
  postprocessfn: result => {
    return {
      population: result.population,
      area: result.area,
      total: (result.population / 20) + (result.area * 3)
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
