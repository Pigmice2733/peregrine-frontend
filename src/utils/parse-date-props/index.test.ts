import { parseDateProps } from '.'

test('parses dates in an object', () => {
  expect(
    parseDateProps({ asdf: 'caleb', date: '2018-11-10T22:18:47.494Z' }, [
      'date',
    ]),
  ).toEqual({ asdf: 'caleb', date: new Date('2018-11-10T22:18:47.494Z') })
})

test("ignores keys that don't exist", () => {
  expect(parseDateProps({ name: 'caleb' }, ['sdf'])).toEqual({ name: 'caleb' })
})
