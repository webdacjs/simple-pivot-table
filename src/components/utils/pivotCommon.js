
import soa from 'sort-objects-array'

export function removeNewLines (val) {
  return val.replace(/(\r\n|\n|\r)/gm, '')
}

export function getColumns (columnsLabels, rows, values) {
  const columnsCombined = [...rows, ...values.map(x => x.field)]
  if (columnsLabels) {
    return columnsCombined.map((col, i) => columnsLabels[i] ? columnsLabels[i] : col)
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

function getMostCommonSeparator (val) {
  const possibleDelimiters = ['\t', ',', ';', '","']
  const delimitersCount = possibleDelimiters.reduce(
    (obj, key) => { obj[key] = val.split(key).length; return obj }, {})
  const sorted = soa(delimitersCount, 'value', 'desc')
  // Deal with "," case
  if ((sorted[1] || {}).key === '","' && sorted[0].key === ',') {
    return sorted[1].key
  }
  return sorted[0].key
}

export function csvToJson (val) {
  const separator = getMostCommonSeparator(val)
  const splitcsv = separator === '","'
    ? val.split('\n').filter(x => x).map(x => x.slice(1, -1))
    : val.split('\n').filter(x => x)
  const header = splitcsv[0].split(separator).map(x => removeNewLines(x))

  const json = splitcsv.slice(1).map(line =>
    line.split(separator).map(x => removeNewLines(x)).reduce(
      (obj, key, i) => { obj[header[i]] = key; return obj }, {})
  )
  return json
}

export function getCsvContents (pivotRows, cols, rows, showColumnTotals, colsTotals) {
  const header = `"${cols.join('","')}"`
  const thisRows = pivotRows
    .map(x =>
      x.map(y => y.value)
        .map(z => z)
    ).map(x => `"${x.join('","')}"`)
  if (showColumnTotals) {
    const totalLine = new Array(rows.length).fill('totals')
    Object.keys(colsTotals).forEach(item => {
      totalLine.push(colsTotals[item])
    })
    thisRows.push(`"${totalLine.join('","')}"`)
  }
  return [header, ...thisRows].join('\n')
}
