export const formatTime = (date: string, timeZone?: string) =>
  new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    weekday: 'short',
    timeZone,
  })
