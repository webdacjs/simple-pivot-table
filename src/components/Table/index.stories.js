import React from 'react'

import Table from './index'
import './index.css'

import testData from '../../testData/'

export default {
  title: 'Table',
  component: Table
}

const Template = ({
  data,
  columns,
  columnsLabels,
  filters,
  height,
  width
}) =>
  <Table
    data={data}
    columns={columns}
    columnsLabels={columnsLabels}
    filters={filters}
    height={height}
    width={width}
  />

export const Default = Template.bind({})
Default.args = {
  data: testData
}

export const Filtered = Template.bind({})
Filtered.args = {
  data: testData,
  filters: [
    val => val.government === 'Republic',
    val => val.continent === 'Africa'
  ]
}
