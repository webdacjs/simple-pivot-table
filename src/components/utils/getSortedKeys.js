import {separator} from './settings'
import sortArray  from 'sort-array'
const possibleOrder = ['asc', 'desc']


export default function getSortedkeys (keys, rows, orderBy = []) {
    if (orderBy.length === 0) {
        return keys.sort()
    }
    const orderByObj = orderBy
        .filter(x => possibleOrder.includes(x.order))
        .reduce((obj, item) => {
            obj[item.field] = item.order 
            return obj
        }, {})
    const keysRows = keys.map(key => 
        key.split(separator)
        .reduce((obj, k, i) => {
            obj[rows[i]] = k
            return obj
        }, {})
    )
    const sortArrayObj = {
        by: rows,
        order: rows.map((x, i) => orderByObj[x] ? orderByObj[x] : 'asc') 
    }
    const sorterKeysRows = sortArray(keysRows, sortArrayObj)
    const sortedKeys = sorterKeysRows.map(x => 
        Object.keys(x).map(v => x[v]).join(separator))
    return sortedKeys
  }