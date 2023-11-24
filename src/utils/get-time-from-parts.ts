export const getTimeFromParts = (date: string, time: string) => {
  const now = new Date(Date.now())
  if (date.length !== 5 || time.length !== 5) return now.toISOString()

  const month = Number.parseInt(date.slice(0, 2))
  const day = Number.parseInt(date.slice(3, 5))
  const hour = Number.parseInt(time.slice(0, 2))
  const minute = Number.parseInt(time.slice(3, 5))
  const inputDate = new Date(now.getFullYear(), month, day, hour, minute)
  return inputDate.toISOString()
}
