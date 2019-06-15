import { request } from '../base'
import { EventInfo, processEvent, ProcessedEventInfo } from '.'
import { transaction } from '@/cache'
import { requestIdleCallback } from '@/utils/request-idle-callback'

const updateCachedEvents = (events: ProcessedEventInfo[]) =>
  transaction(
    'events',
    eventStore => {
      events.forEach(event => eventStore.put(event, event.key))
    },
    'readwrite',
  )

// Getting events will only list TBA events, unless a user is signed in. If the
// user is a super-admin, they will see all events, otherwise they will see all
// TBA events and additionally all the custom events on their realm.
export const getEvents = () =>
  request<EventInfo[]>('GET', 'events')
    .then(events => events.map(processEvent))
    .then(events => {
      requestIdleCallback(() => updateCachedEvents(events))
      return events
    })
