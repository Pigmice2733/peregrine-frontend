import { useNetworkCache } from 'src/utils/use-network-cache'
import { getEvents } from 'src/api/event-info/get-events'
import { getCachedEvents } from './get-cached'

// eslint-disable-next-line caleb/react-hooks/rules-of-hooks
export const useEvents = useNetworkCache(getEvents, getCachedEvents)
