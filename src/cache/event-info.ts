import { useState, useEffect } from 'preact/hooks'
import { ProcessedEventInfo } from '@/api/event-info'
import { getEventInfo } from '@/api/event-info/get-event-info'
import { fastestPromise } from '@/utils/fastest-promise'
import { transaction } from '.'

const getCachedEventInfo = (eventKey: string) =>
  transaction<ProcessedEventInfo>('events', eventStore =>
    eventStore.get(eventKey),
  )

export const updateCachedEventInfo = (
  eventKey: string,
  eventInfo: ProcessedEventInfo,
) =>
  transaction(
    'events',
    eventStore => {
      eventStore.put(eventInfo, eventKey)
    },
    'readwrite',
  )

export const getFastestEventInfo = (eventKey: string) =>
  fastestPromise(getEventInfo(eventKey), getCachedEventInfo(eventKey))

export const useEventInfo = (eventKey: string) => {
  const [eventInfo, setEventInfo] = useState<ProcessedEventInfo | undefined>(
    undefined,
  )

  useEffect(() => {
    getCachedEventInfo(eventKey).then(cachedEventInfo =>
      // don't update state using the cached data if network has already returned
      setEventInfo(eventInfo => eventInfo || cachedEventInfo),
    )

    getEventInfo(eventKey).then(networkEventInfo => {
      setEventInfo(networkEventInfo)
    })
  }, [eventKey])

  return eventInfo
}
