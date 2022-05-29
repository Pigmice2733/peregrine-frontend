import { usePromise } from './use-promise'
import { getYears } from '@/api/get-years'
import { getCachedEvents } from '@/cache/events/get-cached'
import { isData } from './is-data'

export const useYears = () => {
  const cachedEventsFromAllYears = usePromise(getCachedEvents)
  const currentYear = new Date().getFullYear()
  return (
    usePromise(getYears) ||
    (isData(cachedEventsFromAllYears)
      ? [
          ...cachedEventsFromAllYears.reduce((years, e) => {
            years.add(e.endDate.getFullYear())
            return years
          }, new Set<number>()),
        ].sort()
      : [currentYear])
  )
}
