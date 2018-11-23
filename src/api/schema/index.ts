interface StatDescription {
  name: string
  id: string
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
