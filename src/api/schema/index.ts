export type StatType = 'boolean' | 'number' | 'string'

export interface StatDescription {
  name: string
  reportReference?: string
  tbaReference?: string
  anyOf?: ({ name: string; equals: string })[]
  sum?: ({ name: string })[]
  hide?: boolean
  period: 'auto' | 'teleop'
  type: StatType
}

export interface BooleanStatDescription extends StatDescription {
  reportReference: string
  type: 'boolean'
}

export interface NumberStatDescription extends StatDescription {
  reportReference: string
  type: 'number'
}

export type ReportStatDescription =
  | BooleanStatDescription
  | NumberStatDescription

export interface Schema {
  id: number
  // If created for a specific realm
  realmId?: number
  // If created for a specific year's main FRC game
  year?: number
  schema: StatDescription[]
}
