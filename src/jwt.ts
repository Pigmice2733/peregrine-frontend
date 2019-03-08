import { Roles } from '@/api/user'
import { refreshToken } from './api/refresh-token'

let jwt: string | null = null

export interface JWT {
  exp: number
  pigmiceRealm: number
  pigmiceRoles: Roles
  sub: string
  raw: string
}

const isExpired = (jwt: JWT) =>
  jwt.exp <= Math.floor(new Date().getTime() / 1000)

export const setRefreshToken = (token: string) =>
  localStorage.setItem('refreshToken', token)

let refreshPromise: Promise<JWT> | null = null

export const getJWT = (): Promise<JWT> | JWT | void => {
  const j = jwt || localStorage.getItem('jwt')

  const parsed = j && parseJWT(j)

  if (!parsed || isExpired(parsed)) {
    setJWT(null)
    const rToken = localStorage.getItem('refreshToken')

    // request a new access token using the refresh token
    if (rToken && !isExpired(parseJWT(rToken))) {
      // if there is an existing request, use that instead of making a new one
      return (
        refreshPromise ||
        (refreshPromise = refreshToken(rToken).then(({ accessToken }) => {
          setJWT(accessToken)
          refreshPromise = null
          return parseJWT(accessToken)
        }))
      )
    }
    return localStorage.removeItem('refreshToken')
  }

  jwt = j
  return parsed
}

const parseJWT = (jwt: string) => {
  const payload = jwt.split('.', 2)[1]
  const data = JSON.parse(atob(payload))
  data.raw = jwt
  return data as JWT
}

export const setJWT = (newJWT: string | null) => {
  jwt = newJWT
  jwt ? localStorage.setItem('jwt', jwt) : localStorage.removeItem('jwt')
}
