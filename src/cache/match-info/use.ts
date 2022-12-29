import { useNetworkCache } from 'src/utils/use-network-cache'
import { getEventMatchInfo } from 'src/api/match-info/get-event-match-info'
import { getCachedMatchInfo } from './get-cached'

// eslint-disable-next-line caleb/react-hooks/rules-of-hooks
export const useMatchInfo = useNetworkCache(
  getEventMatchInfo,
  getCachedMatchInfo,
)
