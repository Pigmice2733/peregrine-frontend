import { request } from '../base'

// Super-admins can delete realms, admins can delete their own realm
export const deleteRealm = (id: number) =>
  request<null>('DELETE', `realms/${id}`)
