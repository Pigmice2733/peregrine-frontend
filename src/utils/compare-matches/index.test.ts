import { compareMatches } from '.'

test.each([
  ['qm10', 'qm1', 1],
  ['qf1m1', 'qf3m2', -1],
  ['qf3m1', 'f3m2', -1],
  ['sf3m1', 'sf4m1', -1],
])('compare %s and %s', (a, b, expected) => {
  expect(Math.sign(compareMatches({ key: a }, { key: b }))).toEqual(expected)
})
