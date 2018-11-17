import { request } from '../base'
import { BasicEventInfo, processEvent } from '.'

export const getEvents = () =>
  request('GET', 'events', (events: BasicEventInfo[]) =>
    events.map(processEvent),
  )
