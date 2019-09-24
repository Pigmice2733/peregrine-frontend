import { useNetworkCache } from '@/utils/use-network-cache'
import { getSchema } from '@/api/schema/get-schema'
import { getCachedSchema } from './get-cached'

// eslint-disable-next-line caleb/react-hooks/rules-of-hooks
export const useSchema = useNetworkCache(getSchema, getCachedSchema)
