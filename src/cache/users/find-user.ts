import { getUser } from '@/api/user/get-user'
import { getCachedUser } from './get-cached'
import { useNetworkCache } from '@/utils/use-network-cache'

// eslint-disable-next-line caleb/react-hooks/rules-of-hooks
export const findUserDetails = useNetworkCache(getUser, getCachedUser)
