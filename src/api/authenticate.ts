import { request } from './base'

export const authenticate = (username: string, password: string) =>
  request<{ jwt: string }>('POST', 'authenticate', { username, password })
