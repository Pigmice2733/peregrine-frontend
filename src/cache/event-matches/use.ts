import { getEventMatches } from 'src/api/match-info/get-event-matches'
import { getCachedEventMatches } from './get-cached'
import { useNetworkCache } from 'src/utils/use-network-cache'

// eslint-disable-next-line caleb/react-hooks/rules-of-hooks
export const useEventMatches = useNetworkCache(
  getEventMatches,
  getCachedEventMatches,
)
