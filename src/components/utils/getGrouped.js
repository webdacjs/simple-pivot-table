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

// This function creates a combined key that is used to aggregated data.
// ie. Europe___Switzerland, etc
function getCombinedKeyBasedOnRowAttributes (dataItem, rowAttributes) {
  const keyArray = []
  rowAttributes.forEach((rowAttribute, i) => {
    keyArray.push(dataItem[rowAttribute] || ' ')
  })
  const combinedKeyArray = keyArray.join(separator)
  return combinedKeyArray
}

// Get the data combined by attribute including the mutations done by th postprocess function
// with the originals if required.
export default function getGroupedData (data, rowAttributes, vals, postprocessfn, getOriginalsFlag) {
  const grouped = {}
  data.forEach(dataItem => {
    const combinedKeyArray = getCombinedKeyBasedOnRowAttributes(dataItem, rowAttributes)
    grouped[combinedKeyArray] = grouped[combinedKeyArray] || []
    grouped[combinedKeyArray].push(dataItem)
  })
  if (getOriginalsFlag) {
    const groupedOriginals = { ...grouped }
    Object.keys(grouped).forEach(key => {
      grouped[key] = getAggregatedValues(grouped[key], vals, postprocessfn)
      if (!postprocessfn) {
        groupedOriginals[key] = grouped[key]
      } else {
        groupedOriginals[key] = getAggregatedValues(groupedOriginals[key], vals)
      }
    })
    const valueTotals = getAggregatedValues(data, vals, postprocessfn)

    return {
      groupedOriginals,
      grouped,
      valueTotals
    }
  }
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
