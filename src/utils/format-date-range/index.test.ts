import { formatDateRange } from '.'

describe('formatDateRange', () => {
  it('should format days from the same month', () => {
    expect(
      formatDateRange(
        new Date('2018-03-08T08:00:00Z'),
        new Date('2018-03-10T08:00:00Z'),
      ),
    ).toEqual('March 8-10')
  })
  it('should format days from different months', () => {
    expect(
      formatDateRange(
        new Date('2018-03-08T08:00:00Z'),
        new Date('2018-04-10T08:00:00Z'),
      ),
    ).toEqual('March 8-April 10')
  })
  it('should format single-day events', () => {
    expect(
      formatDateRange(
        new Date('2018-10-20T04:00:00Z'),
        new Date('2018-10-20T04:00:00Z'),
        'America/Los_Angeles',
      ),
    ).toEqual('October 19')
  })
})
