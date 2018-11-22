import { EditableUser } from '.'
import { request } from '../base'

// Anyone can create a user. For admins the users will be verified automatically
// for non-admins or non-authenticated users the user will not be verified and
// will require admin approval
export const createUser = (user: EditableUser) =>
  request<number | false>('POST', 'users', user)
