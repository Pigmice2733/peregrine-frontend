import { request } from '../base'
import { EventInfo, processEvent, ProcessedEventInfo } from '.'
import { transaction } from '@/cache'
import { requestIdleCallback } from '@/utils/request-idle-callback'
import { idbPromise } from '@/utils/idb-promise'

const updateCachedEvents = (events: ProcessedEventInfo[], year?: number) =>
  transaction(
    'events',
    (eventStore) => {
      // Remove events that are in cache but no longer exist on the server
      idbPromise(eventStore.getAll()).then(
        (allEvents: ProcessedEventInfo[]) => {
          allEvents.forEach((event) => {
            // If the event is from the year that we requested, but did not come back in the response
            if (
              event.endDate.getFullYear() === year &&
              !events.some((e) => e.key === event.key)
            ) {
              // Remove it
              eventStore.delete(event.key)
            }
          })
        },
      )
      events.forEach((event) => eventStore.put(event, event.key))
    },
    'readwrite',
  )

// Getting events will only list TBA events, unless a user is signed in. If the
// user is a super-admin, they will see all events, otherwise they will see all
// TBA events and additionally all the custom events on their realm.
export const getEvents = (year?: number) =>
  request<EventInfo[]>('GET', 'events', { year })
    .then((events) => events.map(processEvent))
    .then((events) => {
      requestIdleCallback(() => updateCachedEvents(events, year))
      return events
    })
