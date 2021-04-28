import { separator, subtotalsSuffix } from './settings'

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

export function getGroups (data, rowAttributes, showSectionTotals) {
  const grouped = {}
  data.forEach(dataItem => {
    const combinedKeyArray = getCombinedKeyBasedOnRowAttributes(dataItem, rowAttributes)
    grouped[combinedKeyArray] = grouped[combinedKeyArray] || []
    grouped[combinedKeyArray].push(dataItem)
    if (showSectionTotals && rowAttributes.length > 1) {
      const combinedSplit = combinedKeyArray.split(separator)
      const getTotalLabel = i => i === combinedSplit.length - 1 ? `${subtotalsSuffix}Totals` : subtotalsSuffix
      const combinedKeyshowSectionTotals = combinedSplit.map
      ((x, i) => i === 0 ? x : getTotalLabel(i)).join(separator)
      grouped[combinedKeyshowSectionTotals] = grouped[combinedKeyshowSectionTotals] || []
      grouped[combinedKeyshowSectionTotals].push(dataItem)
    }
  })
  return grouped
}

// Get the data combined by attribute including the mutations done by th postprocess function
// with the originals if required.
export default function getGroupedData ({
  data, 
  rowAttributes,
  vals,
  postprocessfn,
  getOriginalsFlag,
  showSectionTotals,
  calculateSectionPercentage,
  calculateTotalsPercentage
}) {
  const grouped = getGroups(data, rowAttributes, showSectionTotals)
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

  if (vals.length === 1 && calculateTotalsPercentage) {
    const valKey = vals[0].field
    const groupedPerc = Object.keys(grouped).reduce((obj, key) => {
      obj[key] = {
        ...grouped[key],
        perc_total: `${(grouped[key][valKey] / valueTotals[valKey] * 100).toFixed(2)}%`
      }; return obj
    }, {})
    const valueTotalsPerc = { ...valueTotals, perc_total: '100%' }
    return {
      grouped: groupedPerc,
      valueTotals: valueTotalsPerc
    }
  }

  return {
    grouped,
    valueTotals
  }
}
