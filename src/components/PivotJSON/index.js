import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { getPivotJsonData } from '../utils/pivotMain'

export default function PivotJSON ({
  data,
  filters,
  rows,
  columnsLabels,
  values,
  postprocessfn,
  showColumnTotals,
  showRowsTotals,
  showSectionTotals,
  calculateSectionPercentage,
  calculateTotalsPercentage,
  getTree
}) {
  const [JSONData, setJSONData] = useState()

  useEffect(() => {
    const JSONContents = getPivotJsonData({
      data,
      filters,
      rows,
      values,
      columnsLabels,
      postprocessfn,
      showColumnTotals,
      showSectionTotals,
      calculateSectionPercentage,
      calculateTotalsPercentage,
      getTree
    })
    setJSONData(JSONContents)
  }, [data, rows, values, columnsLabels]) // eslint-disable-line

  return (
    <div>
      {JSONData &&
        <textarea
          style={{ width: '100%', height: '500px' }}
          value={JSON.stringify(JSONData, null, 4)}
          readOnly
        />}
    </div>
  )
}

PivotJSON.propTypes = {
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
  getTree: PropTypes.bool,
  postprocessfn: PropTypes.func,
  showColumnTotals: PropTypes.bool,
  showRowsTotals: PropTypes.bool,
  showSectionTotals: PropTypes.bool,
  calculateSectionPercentage: PropTypes.bool,
  calculateTotalsPercentage: PropTypes.bool,
  width: PropTypes.number
}
