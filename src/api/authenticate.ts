import { request } from './base'
import { setJWT, setRefreshToken } from '@/jwt'

export const authenticate = (username: string, password: string) =>
  request<{ refreshToken: string; accessToken: string }>(
    'POST',
    'authenticate',
    {},
    { username, password },
  ).then(({ refreshToken, accessToken }) => {
    setJWT(accessToken)
    setRefreshToken(refreshToken)
  })
