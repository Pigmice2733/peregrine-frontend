import { formatPercent } from '.'

test.each`
  number    | expected
  ${1}      | ${'100%'}
  ${0}      | ${'0%'}
  ${0.5}    | ${'50%'}
  ${0.5678} | ${'56.8%'}
`('formats $number to $expected', ({ number, expected }) => {
  expect(formatPercent(number)).toEqual(expected)
})
