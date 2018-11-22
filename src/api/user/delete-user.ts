import { request } from '../base'

// Anyone can delete themselves, admins can delete other users in their realm,
// super-admins can delete any user.
export const deleteUser = (userId: number) =>
  request<null>('DELETE', `users/${userId}`)
