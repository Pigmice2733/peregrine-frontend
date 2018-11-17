import { request } from '../base'
import { EventInfo, processEvent } from '.'

export const getEventInfo = (eventKey: string) =>
  request('GET', `events/${eventKey}`, (e: EventInfo) => processEvent(e))
