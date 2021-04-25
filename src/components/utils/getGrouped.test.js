import {
    getNumericValue
} from './getGrouped'

test('Testing the getNumericValue function', () => {
    const fromStr = getNumericValue('30')
    const fromNumber = getNumericValue(30)
    const noNumber = getNumericValue('juan')
    expect(fromStr).toBe(30)
    expect(fromNumber).toBe(30)
    expect(noNumber).toBe(0)
})
