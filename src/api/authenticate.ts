import { request } from './base'
import { setAccessToken, setRefreshToken } from 'src/jwt'

export const authenticate = (username: string, password: string) =>
  request<{ refreshToken: string; accessToken: string }>(
    'POST',
    'authenticate',
    {},
    { username, password },
  ).then(({ refreshToken, accessToken }) => {
    setAccessToken(accessToken)
    setRefreshToken(refreshToken)
    return accessToken
  })
