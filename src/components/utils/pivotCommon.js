
export function getColumns (columnsLabels, rows, values) {
  const columnsCombined = [...rows, ...values.map(x => x.field)]
  if (columnsLabels) {
    return columnsCombined.map((col, i) => columnsLabels[i] ? columnsLabels[i] : col )
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

export function timerFn (funtionName) {
  const t0 = performance.now()
  return () => {
    const t1 = performance.now()
    console.log(`TIMER (${funtionName}) took ${(t1 - t0)}  milliseconds.`)
  }
}
