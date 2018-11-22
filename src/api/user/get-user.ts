import { request } from '../base'
import { UserInfo } from '.'

// Admins can view any user, users can view themselves
export const getUser = (userId: number) =>
  request<UserInfo>('GET', `users/${userId}`)
