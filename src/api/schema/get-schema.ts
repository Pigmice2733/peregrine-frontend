import { request } from '../base'
import { Schema } from '.'

// Standard FRC schemas, and schemas from public realms can be viewed by anyone.
// Members of a realm can view any schemas from their realm, super-admins can
// view any schema.
export const getSchema = (id: number) => request<Schema>('GET', `schemas/${id}`)
