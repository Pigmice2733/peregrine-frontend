import { transaction } from '..'
import { ProcessedEventInfo } from 'src/api/event-info'
import { preventUndefinedResolve } from 'src/utils/prevent-undefined-resolve'

export const getCachedEventInfo = (eventKey: string) =>
  transaction<ProcessedEventInfo | undefined>('events', (eventStore) =>
    eventStore.get(eventKey),
  ).then(preventUndefinedResolve)
