import { request } from '../base'
import { EventInfo, processEvent } from '.'
import { updateCachedEvents } from '@/cache/events'

// Getting events will only list TBA events, unless a user is signed in. If the
// user is a super-admin, they will see all events, otherwise they will see all
// TBA events and additionally all the custom events on their realm.
export const getEvents = () =>
  request<EventInfo[]>('GET', 'events')
    .then(events => events.map(processEvent))
    .then(events => {
      updateCachedEvents(events)
      return events
    })
