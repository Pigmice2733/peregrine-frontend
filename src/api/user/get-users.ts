import { request } from '../base'
import { UserInfo } from '.'

// Admins can view the list of users
export const getUsers = () => request<UserInfo[]>('GET', 'users')
