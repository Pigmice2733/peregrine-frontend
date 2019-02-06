const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: 'numeric',
  weekday: 'short',
})

export const formatTime = (date: Date) => timeFormatter.format(date)
