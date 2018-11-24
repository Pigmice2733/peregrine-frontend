import { request } from '../base'
import { BaseRealm } from '.'

// Only super-admins can create new realms. Creating a new realm will return the
// ID of that realm.
export const createRealm = (realm: BaseRealm) =>
  request<number>('POST', `realms`, {}, realm)
