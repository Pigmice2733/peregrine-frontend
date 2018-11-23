import { request } from '../base'

interface StatDescription {
  statName: string
  statId: string
  type: 'boolean' | 'number'
}

export interface Schema {
  id: number
  // If created for a specific realm
  realmId?: number
  // If created for a speific year's main FRC game
  year?: number
  teleop: StatDescription[]
  auto: StatDescription[]
}

// Admins can create schemas for their realms, super-admins can create schemas
// for main-season FRC games.
export const createSchema = (schema: Schema) =>
  request<null>('POST', `schemas`, schema)
