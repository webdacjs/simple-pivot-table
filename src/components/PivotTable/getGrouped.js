import { separator } from './settings'

function getReducedValue (values, aggregator, formatter) {
  if (aggregator === 'sum') {
    const rawValue = values.reduce((a, b) => a + (b || 0), 0)
    return formatter ? formatter(rawValue) : rawValue
  }
  if (aggregator === 'avg') {
    const rawValue = values.reduce((a, b) => a + (b || a), 0) / values.length
    return formatter ? formatter(rawValue) : rawValue
  }
  if (aggregator === 'median') {
    const rawValue = values[Math.round(values.length / 2)]
    return formatter ? formatter(rawValue) : rawValue
  }
  // default count
  return values.length
}

function getAggregatedValues (items, vals, postprocessfn) {
  const reduced = {}
  vals.forEach(val => {
    const values = items.map(item => item[val.field])
    reduced[val.field] = getReducedValue(values, val.aggregator, val.formatter)
  })
  return postprocessfn ? postprocessfn(reduced) : reduced
}

export default function getGroupedData (data, rows, vals, postprocessfn) {
  const grouped = {}
  data.forEach(dataItem => {
    const keyArray = []
    rows.forEach((row, i) => {
      keyArray.push(dataItem[row] || 'null')
    })
    const combinedKeyArray = keyArray.join(separator)
    grouped[combinedKeyArray] = grouped[combinedKeyArray] || []
    grouped[combinedKeyArray].push(dataItem)
  })
  // Get the reduced values by key.
  Object.keys(grouped).forEach(key => {
    grouped[key] = getAggregatedValues(grouped[key], vals, postprocessfn)
  })
  const valueTotals = getAggregatedValues(data, vals, postprocessfn)

  return {
    grouped,
    valueTotals
  }
}
