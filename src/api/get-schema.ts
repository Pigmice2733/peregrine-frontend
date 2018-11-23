import { request } from './base'

interface StatDescription {
  statName: string
  statKey: string
  type: 'boolean' | 'number'
}

interface Schema {
  teleop: StatDescription[]
  auto: StatDescription[]
}

export const getSchema = () => request<Schema>('GET', `schema`)
