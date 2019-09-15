import { useNetworkCache } from '@/utils/use-network-cache'
import { getEventMatchInfo } from '@/api/match-info/get-event-match-info'
import { getCachedMatchInfo } from './get-cached'

// eslint-disable-next-line caleb/react-hooks/rules-of-hooks
export const useMatchInfo = useNetworkCache(
  getEventMatchInfo,
  getCachedMatchInfo,
)
