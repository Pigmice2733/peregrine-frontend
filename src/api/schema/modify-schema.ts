import { request } from '../base'
import { Schema } from '.'
import { JSONPatch } from '@/type-utils'

// Admins can patch schemas for any event in their realms, or for FRC events if
// their realm's data is private.
export const modifySchema = (id: number, schema: JSONPatch<Schema>) =>
  request<null>('PATCH', `schemas/${id}`, {}, schema)
