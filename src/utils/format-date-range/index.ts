export const formatDateRange = (
  startDate: Date,
  endDate: Date,
  timeZone?: string,
) => {
  const start = startDate
  const end = endDate
  const sameYear = start.getFullYear() === end.getFullYear()
  const sameMonth = sameYear && start.getMonth() === end.getMonth()
  const sameDay = sameMonth && start.getDate() === end.getDate()
  return (
    start.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      timeZone,
    }) +
    (sameDay
      ? ''
      : '-' +
        end.toLocaleDateString('en-US', {
          month: sameMonth ? undefined : 'long',
          day: 'numeric',
          timeZone,
        }))
  )
}
