import getGroupedData, {
  getNumericValue,
  getReducedValue,
  getGroups
} from './getGrouped'

import data from '../../testData/index.json'

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

test('Testing the getGroups fn', () => {
  const groups = getGroups(data, ['continent', 'country'])
  expect(Object.keys(groups).length).toBe(244)
})

test('Testing the getGroups fn getting section totals', () => {
    const groups = getGroups(data, ['continent', 'country'], true)
    expect(Object.keys(groups).length).toBe(251)
})


test('Testing the main grouped data fn', () => {
  const { grouped } = getGroupedData(data, ['continent'], [{ field: 'population' }])
  expect(grouped.Asia.population).toBe(50)
  expect(grouped.Europe.population).toBe(51)
})

test('Testing the main grouped data fn', () => {
    const {grouped} = getGroupedData(data, ['continent', 'country'], [{field: 'population', aggregator: 'sum'}], null, null, true)
    expect(grouped['Africa-----______Totals'].population).toBe(1278740761)
})
