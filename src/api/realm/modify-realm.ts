import { request } from '../base'
import { BaseRealm } from '.'

// Super-admins can modify realms, admins can modify their own realm
export const modifyRealm = (id: number, realm: Partial<BaseRealm>) =>
  request<null>('PUT', `realms/${id}`, {}, realm)
