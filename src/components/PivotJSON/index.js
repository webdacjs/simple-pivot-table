import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { getJsonData } from '../utils/pivotMain'

export default function PivotJSON ({
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
  const [JSONData, setJSONData] = useState()

  useEffect(() => {
    const JSONContents = getJsonData({
      data,
      filters,
      rows,
      values,
      columnsLabels,
      postprocessfn,
      showColumnTotals
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
