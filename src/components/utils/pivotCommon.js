
export function getColumns (columnsLabels, rows, values) {
  if (columnsLabels) {
    return columnsLabels
  }
  return [...rows, ...values.map(x => x.field)]
}

function filterIterations (rawRows, filters) {
  let filteredRows = [...rawRows]
  filters.forEach(filterFn => {
    filteredRows = filteredRows.filter(filterFn)
  })
  return filteredRows
}

export function getFilteredRows (rawRows, filters) {
  return filters
    ? filterIterations(rawRows, filters)
    : rawRows
}
