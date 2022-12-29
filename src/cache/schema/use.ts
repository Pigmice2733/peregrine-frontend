import { useNetworkCache } from 'src/utils/use-network-cache'
import { getSchema } from 'src/api/schema/get-schema'
import { getCachedSchema } from './get-cached'

// eslint-disable-next-line caleb/react-hooks/rules-of-hooks
export const useSchema = useNetworkCache(getSchema, getCachedSchema)
