import { compareEvents } from '.'

test.each([
  [
    { startDate: new Date(100), endDate: new Date(200) },
    { startDate: new Date(300), endDate: new Date(350) },
    1,
  ],
  [
    { startDate: new Date(300), endDate: new Date(325) },
    { startDate: new Date(100), endDate: new Date(120) },
    -1,
  ],
  [
    {
      startDate: new Date(Number(new Date()) + 1000),
      endDate: new Date(Number(new Date()) + 1000),
    },
    { startDate: new Date(300), endDate: new Date(350) },
    -1,
  ],
  [
    {
      startDate: new Date(Number(new Date()) - 1000),
      endDate: new Date(Number(new Date()) + 1000),
    },
    { startDate: new Date(300), endDate: new Date(350) },
    -1,
  ],
  [
    {
      startDate: new Date(Number(new Date()) + 2000),
      endDate: new Date(Number(new Date()) + 3000),
    },
    {
      startDate: new Date(Number(new Date()) + 1000),
      endDate: new Date(Number(new Date()) + 2000),
    },
    1,
  ],
])('compare %s and %s', (a, b, expected) => {
  expect(
    Math.sign(
      compareEvents(
        { startDate: a.startDate, endDate: a.endDate },
        { startDate: b.startDate, endDate: b.endDate },
      ),
    ),
  ).toEqual(expected)
})
