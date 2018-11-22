import { EditableUser } from '.'
import { request } from '../base'

// Anyone can modify themselves
// Only admins can modify other users
export const modifyUser = (userId: number, user: Partial<EditableUser>) =>
  request<null>('PATCH', `users/${userId}`, user)
