import { formatTeamNumber, formatTime, formatMatchName } from '.'

describe('formatTeamNumber', () => {
  it('works with a string', () => {
    expect(formatTeamNumber('frc2733')).toEqual(2733)
  })

  it('returns NaN with an invalid string', () => {
    expect(formatTeamNumber('273frc3')).toBeNaN()
  })
})

describe('formatTime', () => {
  it('works with a string', () => {
    expect(formatTime('2018-04-19T19:37:49Z')).toEqual('12:37 PM')
  })
})

describe('formatMatchKey', () => {
  it('should format a qualification match', () => {
    expect(formatMatchName('qm10')).toEqual({ group: 'Qual 10' })
  })
  it('should format a eighths match', () => {
    expect(formatMatchName('ef8m2')).toEqual({ group: 'Eighths 8', num: '2' })
  })
  it('should format a quarters match', () => {
    expect(formatMatchName('qf3m1')).toEqual({ group: 'Quarters 3', num: '1' })
  })
  it('should format a semis match', () => {
    expect(formatMatchName('sf2m3')).toEqual({ group: 'Semis 2', num: '3' })
  })
  it('should format a finals match', () => {
    expect(formatMatchName('f1m2')).toEqual({ group: 'Finals 1', num: '2' })
  })
  it('should throw if it does not end with a number', () => {
    expect(() => formatMatchName('asdf')).toThrowError(
      'Expected asdf to end in a digit',
    )
  })
})
