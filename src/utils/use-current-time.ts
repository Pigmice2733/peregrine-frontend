import { useEffect, useState } from 'preact/hooks'

const timeListeners = new Set<(d: Date) => void>()

setInterval(() => {
  timeListeners.forEach((l) => l(new Date()))
}, 1000)

export const useCurrentTime = () => {
  const [time, setTime] = useState<Date>(new Date())
  useEffect(() => {
    timeListeners.add(setTime)
    return () => timeListeners.delete(setTime)
  }, [])

  return time
}
