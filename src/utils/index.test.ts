import {
  formatTeamNumber,
  formatTime,
  formatMatchName,
  formatDateRange,
} from '.'

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
    expect(formatTime('2018-04-19T19:37:49Z', 'America/Los_Angeles')).toEqual(
      'Thu 12:37 PM',
    )
  })
})

describe('formatMatchKey', () => {
  it('should format a qualification match', () => {
    expect(formatMatchName('qm10')).toEqual({ group: 'Qual 10' })
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
  it('should return the key as-is if it does not end with a number', () => {
    expect(formatMatchName('asdf')).toEqual({ group: 'ASDF' })
  })
  it('should return the key as-is if it starts with an unrecognized match type', () => {
    expect(formatMatchName('ef3m2')).toEqual({ group: 'EF3M2' })
  })
})

describe('formatDateRange', () => {
  it('should format days from the same month', () => {
    expect(
      formatDateRange('2018-03-08T08:00:00Z', '2018-03-10T08:00:00Z'),
    ).toEqual('March 8-10')
  })
  it('should format days from different months', () => {
    expect(
      formatDateRange('2018-03-08T08:00:00Z', '2018-04-10T08:00:00Z'),
    ).toEqual('March 8-April 10')
  })
  it('should format single-day events', () => {
    expect(
      formatDateRange(
        '2018-10-20T04:00:00Z',
        '2018-10-20T04:00:00Z',
        'America/Los_Angeles',
      ),
    ).toEqual('October 19')
  })
})
