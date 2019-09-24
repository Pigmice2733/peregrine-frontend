import { transaction } from '..'
import { ProcessedEventInfo } from '@/api/event-info'
import { preventEmptyArrResolve } from '@/utils/prevent-empty-arr-resolve'

export const getCachedEvents = () =>
  transaction<ProcessedEventInfo[]>('events', eventStore =>
    eventStore.getAll(),
  ).then(preventEmptyArrResolve)
