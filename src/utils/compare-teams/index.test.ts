import { compareTeams } from '.'

// -1: a is before b
// 1: b is before a

test('compares two teams that are both numbers', () => {
  expect(compareTeams('frc254a', 'frc973b')).toBeLessThan(0)
})

test('compares two teams that with the same number', () => {
  expect(compareTeams('frc254a', 'frc254c')).toBeLessThan(0)
})
