import { request } from '../base'
import { BasicEventInfo, processEvent } from '.'

// Getting events will only list TBA events, unless a user is signed in. If the
// user is a super-admin, they will see all events, otherwise they will see all
// TBA events and additionally all the custom events on their realm.
export const getEvents = () =>
  request<BasicEventInfo[]>('GET', 'events').then(events =>
    events.map(processEvent),
  )
