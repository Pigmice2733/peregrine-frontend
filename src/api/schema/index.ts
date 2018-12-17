export interface StatDescription {
  name: string
  type: 'boolean' | 'number'
}

export interface Schema {
  id: number
  // If created for a specific realm
  realmId?: number
  // If created for a specific year's main FRC game
  year?: number
  teleop: StatDescription[]
  auto: StatDescription[]
}
