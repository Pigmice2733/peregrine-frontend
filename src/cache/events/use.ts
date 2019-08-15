import { useNetworkCache } from '@/utils/use-network-cache'
import { getEvents } from '@/api/event-info/get-events'
import { getCachedEvents } from './get-cached'

export const useEvents = useNetworkCache(getEvents, getCachedEvents)
