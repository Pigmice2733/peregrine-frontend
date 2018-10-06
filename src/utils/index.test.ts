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
    expect(formatMatchName('qm10')).toEqual('Qual 10')
  })
  it('should format a eighths match', () => {
    expect(formatMatchName('ef8m2')).toEqual('Eighths 8 Match 2')
  })
  it('should format a quarters match', () => {
    expect(formatMatchName('qf3m1')).toEqual('Quarters 3 Match 1')
  })
  it('should format a semis match', () => {
    expect(formatMatchName('sf2m3')).toEqual('Semis 2 Match 3')
  })
  it('should format a finals match', () => {
    expect(formatMatchName('f1m2')).toEqual('Finals 1 Match 2')
  })
  it('should throw if it does not end with a number', () => {
    expect(() => formatMatchName('asdf')).toThrowError(
      /Expected asdf to end in a digit/,
    )
  })
})
