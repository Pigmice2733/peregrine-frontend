import { getEventMatches } from '@/api/match-info/get-event-matches'
import { getCachedEventMatches } from './get-cached'
import { useNetworkCache } from '@/utils/use-network-cache'

export const useEventMatches = useNetworkCache(
  getEventMatches,
  getCachedEventMatches,
)
