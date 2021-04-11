import * as d3 from 'd3'

function defaultFormatter (x) {
  if (x > 1000000) {
    return `${(x / 1000000).toFixed(2)} M`
  } else if (x > 1000) {
    return `${(x / 1000).toFixed(2)} k`
  }
  // Avoid many decimal points in the legend.
  const value = Math.round(x) === x ? x : x.toFixed(2)
  return value
}

export default function getLinearScale (minVal, maxVal, steps, legendFormatter) {
  const getScale = d3.scaleLinear()
    .domain([minVal, maxVal])
    .range([0, maxVal])
  const factor = maxVal / steps
  const scaleValues = new Array()
  for (let i = 0; i <= steps; i++) {
    scaleValues.push(getScale(i * factor))
  }
  return scaleValues.map(x => legendFormatter ? legendFormatter(x) : defaultFormatter(x))
}
