import { separator, subtotalsSuffix } from './settings'
import sortArray from 'sort-array'
const possibleOrder = ['asc', 'desc']

function combineSortedKeysWithSubtotalKeys (sortedKeys, subtotalKeys) {
  const extractComparisonValue = keyObj => keyObj[Object.keys(keyObj)[0]]
  const finalKeys = []
  const sortedKeysLength = sortedKeys.length
  sortedKeys.forEach((keyObj, i) => {
    if (i === 0) {
      finalKeys.push(keyObj)
      return
    }

    const previousValue = extractComparisonValue(sortedKeys[i - 1])
    const thisValue = extractComparisonValue(keyObj)
    if (thisValue !== previousValue) {
      const subtotalKey = subtotalKeys.find(x => extractComparisonValue(x) === previousValue)
      finalKeys.push(subtotalKey)
    }
    finalKeys.push(keyObj)
    if (i === sortedKeysLength - 1) {
      const subtotalKey = subtotalKeys.find(x => extractComparisonValue(x) === previousValue)
      finalKeys.push(subtotalKey)
    }
  })
  return finalKeys
}

function orderByReducer (orderBy) {
  return orderBy
    .filter(x => possibleOrder.includes(x.order))
    .reduce((obj, item) => {
      obj[item.field] = item.order
      return obj
    }, {})
}

function getSortableKeyRows (keys, grouped, rows) {
  // Get the k, v but making sure they are cast as numbers
  const values = keys.map(key => grouped[key]).map(obj =>
    Object.keys(obj).reduce((iobj, key) => {
      iobj[key] = !isNaN(obj[key])
        ? Number(obj[key])
        : Number(obj[key].replace(/[^0-9.]/g, ''))
      return iobj
    }, {})
  )

  const keysRows = keys.map((key, i) => {
    const outerObj = key.split(separator)
      .reduce((obj, k, i) => {
        obj[rows[i]] = k
        return obj
      }, {})
    return {
      ...outerObj,
      ...values[i]
    }
  })

  return keysRows
}

export default function getSortedkeys (grouped, rows, valuesFields, orderBy = []) {
  // If there is not a 'order by' directive let's not wasted time and return
  // default asc order.
  const keysAll = Object.keys(grouped)
  if (orderBy.length === 0) {
    return keysAll.sort()
  }

  const keys = keysAll.filter(x => !x.includes(subtotalsSuffix))
  const keysWithSubtotals = keysAll.filter(x => x.includes(subtotalsSuffix))

  // Reduces the 'orderBy' directives into an Object
  const orderByObj = orderByReducer(orderBy)

  // Splits the keys into a sortable array of objects.
  const keysRows = getSortableKeyRows(keys, grouped, rows)

  // Splits also the keyswith subtotals into a sortable array of objects.
  const keyRowsWithSubtotals = keysWithSubtotals.length === 0
    ? keysWithSubtotals
    : getSortableKeyRows(keysWithSubtotals, grouped, rows)

  // It needs some mandatory sort fields for the grouping, the others are optional.
  const mandatory = rows.slice(0, (rows.length - 1))
  const optional = [...rows.slice(rows.length - 1), ...valuesFields].filter(
    field => orderByObj[field])
  const orderFields = [...mandatory, ...optional]

  // Create the sort object configuration to pass to sortArray
  const sortArrayObj = {
    by: orderFields,
    order: orderFields.map(x => orderByObj[x] ? orderByObj[x] : 'asc')
  }

  const sortedKeysRows = sortArray(keysRows, sortArrayObj)

  // Adding back subtotals keys if necessary
  const finalSortedKeyRows = keyRowsWithSubtotals.length === 0
    ? sortedKeysRows
    : combineSortedKeysWithSubtotalKeys(sortedKeysRows, keyRowsWithSubtotals)

  // Compose back the sorted keys.
  const sortedKeys = finalSortedKeyRows.map(x =>
    Object.keys(x).slice(0, rows.length).map(v => x[v]).join(separator))
  return sortedKeys
}
