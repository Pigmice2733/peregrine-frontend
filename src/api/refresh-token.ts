import { request } from './base'

export const refreshToken = (token: string) =>
  request<{ accessToken: string }>(
    'POST',
    'refresh',
    {},
    { refreshToken: token },
  )
