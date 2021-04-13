import React from 'react'
import useD3 from './d3hook.js'
import d3chartBuilder from './d3chartBuilder'

export default function D3Header ({ height, legendValues }) {
  const stepvalue = 100 / (legendValues.length - 1)
  const getWidth = i => stepvalue * i

  const builtDataObject = legendValues.map((x, i) => ({
    dimension: x,
    text: x,
    y: 0,
    width: i === 0 ? 0 : getWidth(i),
    x: 0,
    textX: i === 0 ? 0 : getWidth(i),
    height: height || 16,
    color: 'transparent',
    fontColor: '#495057'
  }))

  const ref = useD3(
    svg => {
      svg.selectAll('*').remove()
      d3chartBuilder(
        svg,
        builtDataObject,
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
