import { round } from '.'

test('rounds a long number', () => {
  expect(round(3.1415)).toEqual(3.14)
})
test('rounds up', () => {
  expect(round(3.147)).toEqual(3.15)
})
