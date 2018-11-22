import { request } from '../base'
import { UserInfo } from '.'

// Super-admins can view the list of all users, admins can view the list of
// users in their realm.
export const getUsers = () => request<UserInfo[]>('GET', 'users')
