import { transaction } from '..'
import { Schema } from '@/api/schema'

export const getCachedSchema = (id: number) =>
  transaction('schemas', async schemaStore => {
    return schemaStore.get(id) as IDBRequest<Schema>
  })
