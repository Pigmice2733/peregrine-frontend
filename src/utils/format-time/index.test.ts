import { formatTime } from '.'

describe('formatTime', () => {
  it('works with a string', () => {
    expect(formatTime(new Date('2018-04-19T19:37:49Z'))).toMatch(
      /\w\w\w \d\d?:\d\d [PA]M/,
    )
  })
})
