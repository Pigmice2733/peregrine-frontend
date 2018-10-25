export const formatDateRange = (
  startDate: string,
  endDate: string,
  timeZone?: string,
) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
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
