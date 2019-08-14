import { request } from '../base'
import { Schema } from '.'
import { transaction } from '@/cache'
import { requestIdleCallback } from '@/utils/request-idle-callback'

const updateCachedSchema = (id: number, schema: Schema) =>
  transaction(
    'schemas',
    schemaStore => {
      schemaStore.put(schema, id)
    },
    'readwrite',
  )

// Standard FRC schemas, and schemas from public realms can be viewed by anyone.
// Members of a realm can view any schemas from their realm, super-admins can
// view any schema.
export const getSchema = (id: number) =>
  request<Schema>('GET', `schemas/${id}`).then(schema => {
    requestIdleCallback(() => updateCachedSchema(id, schema))
    return schema
  })
