import { formatMatchKey } from '.'

describe('formatMatchKey', () => {
  it('should format a qualification match', () => {
    expect(formatMatchKey('qm10')).toEqual({ group: 'Qual 10' })
  })
  it('should format a quarters match', () => {
    expect(formatMatchKey('qf3m1')).toEqual({ group: 'Quarters 3', num: '1' })
  })
  it('should format a semis match', () => {
    expect(formatMatchKey('sf2m3')).toEqual({ group: 'Semis 2', num: '3' })
  })
  it('should format a finals match', () => {
    expect(formatMatchKey('f1m2')).toEqual({ group: 'Finals 1', num: '2' })
  })
  it('should return the key as-is if it does not end with a number', () => {
    expect(formatMatchKey('asdf')).toEqual({ group: 'ASDF' })
  })
  it('should return the key as-is if it starts with an unrecognized match type', () => {
    expect(formatMatchKey('ef3m2')).toEqual({ group: 'EF3M2' })
  })
})
