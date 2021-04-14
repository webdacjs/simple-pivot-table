import filter from 'lodash.filter'

export default function getMinMaxValues (pivotData) {
  const flatData = pivotData.map(arr => filter(
    arr, x => x.type === 'value').map(x => x.value)).flat()

  return {
    calcMinValue: Math.min(...flatData),
    calcMaxValue: Math.max(...flatData)
  }
}
