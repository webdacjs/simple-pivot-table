import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { getPivotCsvData } from '../utils/pivotMain'

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
  const [csvData, setCsvData] = useState()

  useEffect(() => {
    const csvContents = getPivotCsvData({
      data,
      filters,
      rows,
      values,
      columnsLabels,
      postprocessfn,
      showColumnTotals
    })
    setCsvData(csvContents)
  }, [data, rows, values, columnsLabels]) // eslint-disable-line

  return (
    <div>
      {csvData && <textarea style={{ width: '100%', height: '500px' }} value={csvData} readOnly />}
    </div>
  )
}

PivotCsv.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]),
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
