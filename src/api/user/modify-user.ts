import { EditableUser } from '.'
import { request } from '../base'

// Anyone can modify themselves, admins can modify other users in their realm,
// super-admins can modify any user
export const modifyUser = (userId: number, user: Partial<EditableUser>) =>
  request<null>('PATCH', `users/${userId}`, user)
