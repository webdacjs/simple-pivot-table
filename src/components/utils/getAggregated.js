export function getNumericValue (value) {
  const numValue = parseFloat(value)
  if (isNaN(numValue)) {
    return 0
  }
  return numValue
}

export function getReducedValue (values, aggregator, formatter) {
  if (aggregator === 'sum') {
    const rawValue = values.reduce((a, b) => a + (getNumericValue(b) || 0), 0)
    return formatter ? formatter(rawValue) : rawValue
  }
  if (aggregator === 'avg') {
    const rawValue = values.reduce((a, b) => a + (getNumericValue(b) || a), 0) / values.length
    return formatter ? formatter(rawValue) : rawValue
  }
  if (aggregator === 'median') {
    const rawValue = values[Math.round(values.length / 2)]
    return formatter ? formatter(rawValue) : rawValue
  }
  if (typeof aggregator === 'function') {
    const rawValue = values.reduce((a, b) => aggregator(a, b))
    return formatter ? formatter(rawValue) : rawValue
  }
  // default count
  return values.length
}

export default function getAggregatedValues (items, vals, postprocessfn) {
  const reduced = {}
  vals.forEach(val => {
    const values = items.map(item => item[val.field])
    reduced[val.field] = getReducedValue(values, val.aggregator, val.formatter)
  })
  return postprocessfn ? postprocessfn(reduced, items) : reduced
}
