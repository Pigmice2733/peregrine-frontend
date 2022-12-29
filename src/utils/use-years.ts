import { usePromise } from './use-promise'
import { getYears } from 'src/api/get-years'
import { getCachedEvents } from 'src/cache/events/get-cached'

export const useYears = () => {
  const cachedEventsFromAllYears = usePromise(getCachedEvents)
  const currentYear = new Date().getFullYear()
  return (
    usePromise(getYears) ||
    (cachedEventsFromAllYears
      ? [
          ...cachedEventsFromAllYears.reduce((years, e) => {
            years.add(e.endDate.getFullYear())
            return years
          }, new Set<number>()),
        ].sort()
      : [currentYear])
  )
}
