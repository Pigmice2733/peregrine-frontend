import { transaction } from '.'
import { useNetworkCache } from '@/utils/use-network-cache'
import { createPromiseRace } from '@/utils/fastest-promise'
import { Schema } from '@/api/schema'
import { getSchema } from '@/api/schema/get-schema'

const getCachedSchema = (id: number) =>
  transaction('schemas', async schemaStore => {
    return schemaStore.get(id) as IDBRequest<Schema>
  })

export const getFastestSchema = createPromiseRace(getSchema, getCachedSchema)

export const useSchema = useNetworkCache(getSchema, getCachedSchema)
