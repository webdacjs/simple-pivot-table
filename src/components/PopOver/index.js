import React, { useState } from 'react'
import Popover from 'react-popover'

export default function PopOver ({
  showPopOver,
  dataArray,
  children
}) {
  const [hovered, setHovered] = useState()

  const getPopOver = () => (
    <div className='popoverBox' onMouseOver={() => setHovered(true)} onMouseOut={() => setHovered()}>
      <table className='popOverBox-table'>
        <tbody>
          {dataArray.map((item, i) => (
            <tr key={`tr-${i}`}>
              <td className='popOverBox-table-cell' key={`tdk-${i}`}>
                {item.key}:
              </td>
              <td className='popOverBox-table-cell' key={`tdv-${i}`}>
                <b>{item.value}</b>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <Popover
      isOpen={showPopOver ? hovered : false}
      place='below'
      tipSize={0.01}
      enterExitTransitionDurationMs={0}
      body={getPopOver()}
    >
      <div onMouseOver={() => setHovered(true)} onMouseOut={() => setHovered()}>
        {children}
      </div>
    </Popover>
  )
}
