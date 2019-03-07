import { compareEvents } from '.'

test.each([
  [
    { startDate: new Date(100), endDate: new Date(200), name: 'foo' },
    { startDate: new Date(300), endDate: new Date(350), name: 'bar' },
    1,
  ],
  [
    { startDate: new Date(300), endDate: new Date(325), name: 'foo' },
    { startDate: new Date(100), endDate: new Date(120), name: 'bar' },
    -1,
  ],
  [
    {
      startDate: new Date(Number(new Date()) + 1000),
      endDate: new Date(Number(new Date()) + 1000),
      name: 'foo',
    },
    { startDate: new Date(300), endDate: new Date(350), name: 'foo' },
    -1,
  ],
  [
    {
      startDate: new Date(Number(new Date()) - 1000),
      endDate: new Date(Number(new Date()) + 1000),
      name: 'foo',
    },
    { startDate: new Date(300), endDate: new Date(350), name: 'foo' },
    -1,
  ],
  [
    {
      startDate: new Date(Number(new Date()) + 2000),
      endDate: new Date(Number(new Date()) + 3000),
      name: 'foo',
    },
    {
      startDate: new Date(Number(new Date()) + 1000),
      endDate: new Date(Number(new Date()) + 2000),
      name: 'foo',
    },
    1,
  ],
  [
    {
      startDate: new Date(Number(new Date()) + 2000),
      endDate: new Date(Number(new Date()) + 3000),
      name: 'foo',
      week: 1,
    },
    {
      startDate: new Date(Number(new Date()) + 1000),
      endDate: new Date(Number(new Date()) + 2000),
      name: 'bar',
      week: 1,
    },
    1,
  ],
])('compare %s and %s', (a, b, expected) => {
  expect(Math.sign(compareEvents(a, b))).toEqual(expected)
})
