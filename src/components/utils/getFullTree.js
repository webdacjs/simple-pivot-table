import { separator } from './settings'
import set from 'lodash.set'

export default function getFullTree (groupedData) {
  const finalObj = {}
  const { grouped } = groupedData
  Object.keys(grouped).forEach(thisKey => {
    const dotKey = thisKey.split(separator).join('.')
    set(finalObj, dotKey, grouped[thisKey])
  })
  return finalObj
}
