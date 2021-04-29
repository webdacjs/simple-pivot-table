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
  const items  = [{val: 1}, {val: 2}, {val: 3}]
  const vals = [{field: 'val', aggregator: 'sum'}]
  const reduced = getAggregatedValues(items, vals)
  expect(reduced.val).toBe(6)
})
