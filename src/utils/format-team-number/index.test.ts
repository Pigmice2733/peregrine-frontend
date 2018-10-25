import { formatTeamNumber } from '.'

describe('formatTeamNumber', () => {
  it('works with a string', () => {
    expect(formatTeamNumber('frc2733')).toEqual('2733')
  })

  it('returns the string as-is with if it does not start with frc', () => {
    expect(formatTeamNumber('273frc3')).toEqual('273frc3')
  })
})
