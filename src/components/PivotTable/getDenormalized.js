import { separator } from './settings'

function checkVisibility (previousItemSplit, keyCounts, partialK, prevK) {
  if (!previousItemSplit) {
    return true
  } else if (partialK !== prevK) {
    return true
  } else if (keyCounts[partialK] === 1) {
    return true
  }
  return false
}

function getDenormalizedLine (key, data, previousItem, keyCounts, valuesFields) {
  const line = []
  // Add Header
  const previousItemSplit = previousItem ? previousItem.split(separator) : null
  const splitKey = key.split(separator)
  const splitKeyLength = splitKey.length
  for (let norm = 0; norm < splitKeyLength; norm++) {
    const partialK = splitKey.slice(0, norm + 1).join(separator)
    const prevK = previousItemSplit ? previousItemSplit.slice(0, norm + 1).join(separator) : null
    line.push({
      type: 'header',
      value: splitKey[norm],
      rowSpan: keyCounts[partialK],
      visible: checkVisibility(previousItemSplit, keyCounts, partialK, prevK)
    })
  }
  // Add values.
  valuesFields.forEach(v => {
    line.push({
      type: 'value',
      value: data[v],
      visible: true
    })
  })
  return line
}

// This functions is used to calculate later on how many rowSpan will be required
// when generating the actual HTML table.
function getKeysCounts (sortedKeys) {
  const keyCounts = {}
  const l = sortedKeys.length
  // Using for for browser efficiency
  // https://jsben.ch/wY5fo
  for (let x = 0; x < l; x++) {
    const splitKey = sortedKeys[x].split(separator)
    const splitKeyLength = splitKey.length
    for (let y = 0; y < splitKeyLength; y++) {
      const partialK = splitKey.slice(0, y + 1).join(separator)
      keyCounts[partialK] = keyCounts[partialK] ? keyCounts[partialK] + 1 : 1
    }
  }
  return keyCounts
}

export default function getDenormalized (groupedData, rows, values) {
  const valuesFields = values.map(x => x.field)
  const { grouped, totals } = groupedData
  const denormalizedArray = []
  const sortedKeys = Object.keys(grouped).sort()
  const keyCounts = getKeysCounts(sortedKeys)
  sortedKeys.forEach((key, i) => {
    const previousItem = i > 0 ? sortedKeys[i - 1] : null
    denormalizedArray.push(
      getDenormalizedLine(key, grouped[key], previousItem, keyCounts, valuesFields)
    )
  })
  return denormalizedArray
}
