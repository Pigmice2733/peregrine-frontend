const formatTime = (date: Date) => {
  const hourNumber = date.getHours()
  const minuteNumber = date.getMinutes()
  const hours = hourNumber < 10 ? '0' + String(hourNumber) : String(hourNumber)
  const minutes =
    minuteNumber < 10 ? '0' + String(minuteNumber) : String(minuteNumber)
  return hours + ':' + minutes
}

export const getTimeFromParts = (date: string, time?: string) => {
  const now = new Date(Date.now())
  if (date.length !== 5 || (time && time.length !== 5)) return now.toISOString()
  if (!time) time = formatTime(now)

  const month = Number.parseInt(date.slice(0, 2))
  const day = Number.parseInt(date.slice(3, 5))
  const hour = Number.parseInt(time.slice(0, 2))
  const minute = Number.parseInt(time.slice(3, 5))
  const inputDate = new Date(now.getFullYear(), month, day, hour, minute)
  return inputDate.toISOString()
}
