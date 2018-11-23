import { request } from '../base'
import { Schema } from '.'

// Admins can create schemas for any event in their realms, EXCEPT for public
// realms which must use a standard schema for main-season FRC games. Only
// super-admins can create the standard schemas for main-season FRC games.
export const createSchema = (schema: Schema) =>
  request<null>('POST', `schemas`, schema)
