import { request } from '../base'
import { Schema } from '.'

// Admins can create schemas for their realms, super-admins can create schemas
// for main-season FRC games.
export const createSchema = (schema: Schema) =>
  request<null>('POST', `schemas`, schema)
