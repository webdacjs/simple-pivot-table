import React from 'react'
import useD3 from './d3hook.js'
import d3chartBuilder from './d3chartBuilder'

export default function StackChart ({
  dataElement,
  maxValue,
  minValue,
  dimensions,
  colors,
  height,
  showBarValues,
  usePercentages
}) {
  const suffix = usePercentages ? '%' : ''

  const randomColor = () => Math.floor(Math.random() * 16777215).toString(16)

  const getWidth = val => (val * 100) / maxValue

  const values = dimensions.map(x => dataElement[x])

  function getAdustedX (val) {
    if (!minValue || minValue > 0) {
      return val
    }
    if (values.includes(minValue)) {
      return val
    }
    return val + Math.abs(minValue)
  }

  const chartHeight = height || 30

  const chartColors = colors || ['#4e79a7', '#e05759', '#f28e2c']
  const builtDataObject = dimensions.map((x, i) => ({
    dimension: x,
    y: 0,
    text: `${Math.round(dataElement[x])}${suffix}`,
    width: getWidth(dataElement[x]),
    height: chartHeight,
    color: chartColors[i] || randomColor()
  }))
  const widths = builtDataObject.map(x => x.width)
  const builtDataObjectWithX = builtDataObject.map((item, index) =>
    Object.assign(item, {
      x:
        index === 0
          ? getAdustedX(0, item)
          : getAdustedX(
            widths.slice(0, index).reduce((a, b) => a + b, 0),
            item
          )
    })
  )

  console.log({builtDataObjectWithX})

  const ref = useD3(
    svg => {
      svg.selectAll('*').remove()
      d3chartBuilder(
        svg,
        builtDataObjectWithX,
        showBarValues,
        () => console.log
      )
    },
    [dataElement]
  )

  return (
    <svg
      ref={ref}
      style={{
        height: chartHeight,
        width: '100%',
        marginTop: '0px',
        marginRight: '0px',
        marginLeft: '0px'
      }}
    />
  )
}
