import { useNetworkCache } from '@/utils/use-network-cache'
import { getSchema } from '@/api/schema/get-schema'
import { getCachedSchema } from './get-cached'

export const useSchema = useNetworkCache(getSchema, getCachedSchema)
