import getAggregatedValues, {
  getReducedValue,
  getNumericValue
} from './getAggregated'

test('Testing the getNumericValue function', () => {
  const fromStr = getNumericValue('30')
  const fromNumber = getNumericValue(30)
  const noNumber = getNumericValue('juan')
  expect(fromStr).toBe(30)
  expect(fromNumber).toBe(30)
  expect(noNumber).toBe(0)
})

test('Testing the def count reducer', () => {
  const testArray = [5, 10, 15]
  const countReduced = getReducedValue(testArray)
  expect(countReduced).toBe(3)
})

test('Testing the sum reducer', () => {
  const testArray = [5, 10, 15]
  const sumReduced = getReducedValue(testArray, 'sum')
  expect(sumReduced).toBe(30)
})

test('Testing the avg reducer', () => {
  const testArray = [5, 10, 15]
  const avgReduced = getReducedValue(testArray, 'avg')
  expect(avgReduced).toBe(10)
})

test('Testing the custom reducer (min)', () => {
  const customAg = (a, b) => (!a || b < a) ? b : a
  const testArray = [5, 10, 15]
  const minReduced = getReducedValue(testArray, customAg)
  expect(minReduced).toBe(5)
})

test('Testing the custom reducer (max)', () => {
  const customAg = (a, b) => (!a || b > a) ? b : a
  const testArray = [5, 10, 15]
  const maxReduced = getReducedValue(testArray, customAg)
  expect(maxReduced).toBe(15)
})

test('Testing getAggregatedValues', () => {
  const items = [{ val: 1 }, { val: 2 }, { val: 3 }]
  const vals = [{ field: 'val', aggregator: 'sum' }]
  const reduced = getAggregatedValues(items, vals)
  expect(reduced.val).toBe(6)
})

test('Testing getAggregatedValues', () => {
  const items = [{ val: 1 }, { val: 2 }, { val: 3 }]
  const vals = [{ field: 'val', aggregator: 'sum' }]
  const reduced = getAggregatedValues(items, vals)
  expect(reduced.val).toBe(6)
})

test('Testing postprocessfn in getAggregatedValues reduced', () => {
  const items = [{ val: 1 }, { val: 2 }, { val: 3 }]
  const vals = [{ field: 'val', aggregator: 'sum' }]
  const postprocessfn = (res) => ({ val: res.val * 2 })
  const reduced = getAggregatedValues(items, vals, postprocessfn)
  expect(reduced.val).toBe(12)
})

test('Testing postprocessfn in getAggregatedValues mutating completely the reply', () => {
  const items = [{ val: 1, label: 'x' }, { val: 2, label: 'x' }, { val: 3, label: 'y' }]
  const vals = [{ field: 'val', aggregator: 'sum' }]
  const postprocessfn = (res, items) => {
    const labels = Array.from(new Set(items.map(x => x.label)))
    const reducedByFn = labels.reduce((obj, label) => {
      obj[label] = items.filter(x => x.label === label).map(x => x.val).reduce((a, b) => a + b, 0)
      return obj
    }, {})
    return { ...reducedByFn, ...res }
  }
  const reduced = getAggregatedValues(items, vals, postprocessfn)
  expect(reduced.x).toBe(3)
  expect(reduced.y).toBe(3)
  expect(reduced.val).toBe(6)
})
