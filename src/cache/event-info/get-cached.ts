import { transaction } from '..'
import { ProcessedEventInfo } from '@/api/event-info'
import { preventUndefinedResolve } from '@/utils/prevent-undefined-resolve'

export const getCachedEventInfo = (eventKey: string) =>
  transaction<ProcessedEventInfo | undefined>('events', eventStore =>
    eventStore.get(eventKey),
  ).then(preventUndefinedResolve)
