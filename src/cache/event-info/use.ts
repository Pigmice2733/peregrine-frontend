import { useNetworkCache } from '@/utils/use-network-cache'
import { getEventInfo } from '@/api/event-info/get-event-info'
import { getCachedEventInfo } from './get-cached'

// eslint-disable-next-line caleb/react-hooks/rules-of-hooks
export const useEventInfo = useNetworkCache(getEventInfo, getCachedEventInfo)
