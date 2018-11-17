export const formatTime = (date: Date, timeZone?: string) =>
  date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    weekday: 'short',
    timeZone,
  })
