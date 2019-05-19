import { useState, useEffect } from 'preact/hooks'
import { ProcessedEventInfo } from '@/api/event-info'
import { transaction } from '.'
import { getEvents } from '@/api/event-info/get-events'

const getCachedEvents = () =>
  transaction<ProcessedEventInfo[]>('events', eventStore => eventStore.getAll())

export const updateCachedEvents = (events: ProcessedEventInfo[]) =>
  transaction(
    'events',
    eventStore => {
      events.forEach(event => eventStore.put(event, event.key))
    },
    'readwrite',
  )

export const useEvents = () => {
  const [events, setEvents] = useState<ProcessedEventInfo[] | undefined>(
    undefined,
  )

  useEffect(() => {
    getCachedEvents().then(cachedEvents =>
      // don't update state using the cached data if network has already returned
      setEvents(events => events || cachedEvents),
    )

    getEvents().then(networkEvents => {
      setEvents(networkEvents)
    })
  }, [])

  return events
}
