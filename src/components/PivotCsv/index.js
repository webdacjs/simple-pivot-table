import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import getGroupedData from '../utils/getGrouped'
import getDenormalized from '../utils/getDenormalized'
import { getColumns, getFilteredRows } from '../utils/pivotCommon'

export default function PivotCsv ({
  data,
  filters,
  rows,
  columns,
  columnsLabels,
  values,
  postprocessfn,
  showColumnTotals,
  showRowsTotals
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
  }, [data, rows, values, columnsLabels]) // eslint-disable-line

  function getCsvContents () {
    const header = `"${cols.join('","')}"`
    const thisRows = pivotRows
      .map(x =>
        x.map(y => y.value)
          .map(z => z)
      ).map(x => `"${x.join('","')}"`)
    if (showColumnTotals) {
      const totalLine = new Array(rows.length).fill('totals')
      Object.keys(colsTotals).forEach(item => {
        totalLine.push(colsTotals[item])
      })
      thisRows.push(`"${totalLine.join('","')}"`)
    }
    const combined = [header, ...thisRows].join('\n')
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
  showColumnTotals: PropTypes.bool,
  showRowsTotals: PropTypes.bool,
  width: PropTypes.number
}
