import { formatTime } from '.'

describe('formatTime', () => {
  it('works with a string', () => {
    expect(
      formatTime(new Date('2018-04-19T19:37:49Z'), 'America/Los_Angeles'),
    ).toEqual('Thu 12:37 PM')
  })
})
