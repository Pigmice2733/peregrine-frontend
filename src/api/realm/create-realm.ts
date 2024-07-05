import { request } from '../base'
import { BaseRealm, Realm } from '.'

// Only super-admins can create new realms. Creating a new realm will return the
// ID of that realm.
export const createRealm = (realm: BaseRealm) =>
  request<Realm>('POST', `realms`, {}, realm)
