import { request } from './base'
import { createUser } from './user/create-user'

export const refreshToken = (token: string) =>
  request<{ accessToken: string }>(
    'POST',
    'refresh',
    {},
    { refreshToken: token },
    true,
  )
