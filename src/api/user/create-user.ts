import { EditableUser } from '.'
import { request } from '../base'

/** Anyone can create a user. For admins the users will be verified
* automatically, for non-admins or non-authenticated users the user will not be
* verified and will require admin approval. Super-admins can create verified
* users in any realm, admins can only do so in their own realm. */
export const createUser = (user: EditableUser) =>
  request<number | false>('POST', 'users', {}, user)
