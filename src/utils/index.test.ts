import { formatTeamNumber, formatTime } from '.'

describe('formatTeamNumber', () => {
  test('works with a string', () => {
    expect(formatTeamNumber('frc2733')).toEqual(2733)
  })

  test('returns NaN with an invalid string', () => {
    expect(formatTeamNumber('273frc3')).toBeNaN()
  })
})

describe('formatTime', () => {
  test('works with a string', () => {
    expect(formatTime('2018-04-19T19:37:49Z')).toEqual('7:37')
  })
})
