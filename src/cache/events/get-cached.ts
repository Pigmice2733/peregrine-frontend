import { transaction } from '..'
import { ProcessedEventInfo } from '@/api/event-info'
import { preventEmptyArrResolve } from '@/utils/prevent-empty-arr-resolve'

export const getCachedEvents = (year?: number) =>
  transaction<ProcessedEventInfo[]>('events', (eventStore) =>
    eventStore.getAll(),
  )
    .then(preventEmptyArrResolve)
    .then((events) =>
      year ? events.filter((e) => e.endDate.getFullYear() === year) : events,
    )
