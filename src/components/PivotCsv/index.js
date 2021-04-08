import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import getGroupedData from '../utils/getGrouped'
import getDenormalized from '../utils/getDenormalized'

export default function PivotCsv ({ data, filters, rows, columns, columnsLabels, values, postprocessfn }) {
  const [cols, setCols] = useState()
  const [pivotRows, setRows] = useState()

  function getColumns () {
    if (columnsLabels) {
      return columnsLabels
    }
    return [...rows, ...values.map(x => x.field)]
  }

  useEffect(() => {
    const groupedData = getGroupedData(
      getFilteredRows(data), rows, values, postprocessfn)
    const denormalizedData = getDenormalized(groupedData, rows, values)
    setCols(getColumns())
    setRows(denormalizedData)
  }, []) // eslint-disable-line

  function filterIterations (rawRows) {
    let filteredRows = [...rawRows]
    filters.forEach(filterFn => {
      filteredRows = filteredRows.filter(filterFn)
    })
    return filteredRows
  }

  const getFilteredRows = rawRows => filters
    ? filterIterations(rawRows)
    : rawRows

  function getCsvContents () {
    const header = `"${cols.join('","')}"`
    const rows = pivotRows
      .map(x =>
        x.map(y => y.value)
          .map(z => z)
      ).map(x => `"${x.join('","')}"`)
    const combined = [header, ...rows].join('\n')
    return <textarea style={{ width: '100%', height: '500px' }} value={combined} readOnly />
  }

  return (
    <div>
      {cols && pivotRows && getCsvContents()}
    </div>
  )
}

PivotCsv.propTypes = {
  data: PropTypes.array,
  rows: PropTypes.array,
  columns: PropTypes.array,
  columnsLabels: PropTypes.array,
  values: PropTypes.array,
  filters: PropTypes.array,
  height: PropTypes.number,
  postprocessfn: PropTypes.func,
  width: PropTypes.number
}
