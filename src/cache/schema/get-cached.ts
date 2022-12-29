import { transaction } from '..'
import { Schema } from 'src/api/schema'

export const getCachedSchema = (id: number) =>
  transaction('schemas', (schemaStore) => {
    return schemaStore.get(id) as IDBRequest<Schema>
  })
