import React from 'react'
import useD3 from './d3hook.js'
import d3chartBuilder from './d3chartBuilder'

export default function D3Header ({ height, legendValues }) {
  const getWidth = val => (val + 1 * 100) / legendValues.length

  const builtDataObject = legendValues.map((x, i) => ({
    dimension: x,
    text: x,
    y: 0,
    width: getWidth(i),
    height: height || 16,
    color: 'transparent',
    fontColor: '#495057'
  }))
  const widths = builtDataObject.map(x => x.width)
  const builtDataObjectWithX = builtDataObject.map((item, index) =>
    Object.assign(item, {
      x: index === 0 ? 0 : widths.slice(0, index).reduce((a, b) => a + b, 0),
      textX:
        index === 0 ? 0 : widths.slice(0, index).reduce((a, b) => a + b, 0) + (widths[index] / 2)
    })
  )

  const ref = useD3(
    svg => {
      svg.selectAll('*').remove()
      d3chartBuilder(
        svg,
        builtDataObjectWithX,
        true,
        () => console.log
      )
    },
    [legendValues]
  )

  return (
    <svg
      className='svgHeader'
      ref={ref}
      style={{
        height: height,
        width: '100%',
        marginTop: '0px',
        marginRight: '0px',
        marginLeft: '0px'
      }}
    />
  )
}
