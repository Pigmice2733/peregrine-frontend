import { request } from '../base'
import { UserInfo } from '.'

// Super-admins can view any user, admins can view any user in their realm,
// users can view themselves
export const getUser = (userId: number | string) =>
  request<UserInfo>('GET', `users/${userId}`)
