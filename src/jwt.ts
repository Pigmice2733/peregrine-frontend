import { Roles } from '@/api/user'
import { apiUrl } from '@/api/api-url'
import { useState, useEffect } from 'preact/hooks'

const REFRESH_TOKEN = 'refreshToken'
const ACCESS_TOKEN = 'accessToken'

// in-memory cache so we aren't constantly checking localstorage
let accessToken: string | null = null
let refreshToken: string | null = null

export interface JWT {
  exp: number
  peregrineRealm: number
  peregrineRoles: Roles
  sub: string
  raw: string
}

const isExpired = (jwt: JWT) =>
  jwt.exp <= Math.floor(new Date().getTime() / 1000)

const parseJWT = (jwt: string) => {
  const payload = jwt.split('.', 2)[1]
  const data = JSON.parse(atob(payload))
  data.raw = jwt
  return data as JWT
}

// These are "dumb" methods - they just get/modify the values from localstorage/cache
const getAccessToken = () =>
  accessToken || (accessToken = localStorage.getItem(ACCESS_TOKEN))

const getRefreshToken = () =>
  refreshToken || (refreshToken = localStorage.getItem(REFRESH_TOKEN))

export const setAccessToken = (newToken: string) =>
  localStorage.setItem(ACCESS_TOKEN, (accessToken = newToken))

export const setRefreshToken = (newToken: string) =>
  localStorage.setItem(REFRESH_TOKEN, (refreshToken = newToken))

export const removeAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN)
  accessToken = null
}

export const removeRefreshToken = () => {
  localStorage.removeItem(REFRESH_TOKEN)
  refreshToken = null
}

export const logout = () => {
  removeAccessToken()
  removeRefreshToken()
}

// These never return an expired token. If it is expired, they delete it
const getUnexpiredAccessToken = (): JWT | undefined => {
  const rawToken = getAccessToken()
  if (!rawToken) return
  const parsed = parseJWT(rawToken)
  if (isExpired(parsed)) {
    removeAccessToken()
    return
  }
  return parsed
}
const getUnexpiredRefreshToken = (): JWT | undefined => {
  const rawToken = getRefreshToken()
  if (!rawToken) return
  const parsed = parseJWT(rawToken)
  if (isExpired(parsed)) {
    removeRefreshToken()
    return
  }
  return parsed
}

const createAccessToken = async (refreshToken: JWT): Promise<JWT | null> => {
  const res = await fetch(apiUrl + 'refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken: refreshToken.raw }),
  })
  if (!res.ok) {
    // if the api did not like it, remove it because it is invalid
    removeRefreshToken()
    return null
  }
  const { accessToken } = (await res.json()) as { accessToken: string }
  setAccessToken(accessToken)
  return parseJWT(accessToken)
}

// eslint-disable-next-line caleb/@typescript-eslint/require-await
export const getWorkingJWT = async (): Promise<JWT | null> => {
  const accessToken = getUnexpiredAccessToken()
  if (accessToken) return accessToken
  const refreshToken = getUnexpiredRefreshToken()
  if (refreshToken) return createAccessToken(refreshToken)
  return null
}

export const useJWT = () => {
  // undefined means we don't know if user has a token
  // null means user has no token
  const [jwt, setJWT] = useState<JWT | null | undefined>(undefined)

  const checkForWorkingJWT = () => {
    getWorkingJWT().then(setJWT)
  }

  useEffect(checkForWorkingJWT, [])
  return { jwt, checkForWorkingJWT }
}

/**
 * Reads from localstorage, deletes expires tokens, creates a new token if a
 * refresh token is available. Intended to be called when the app starts
 */
export const cleanupTokens = () => {
  const refreshToken = getUnexpiredRefreshToken()
  const accessToken = getUnexpiredAccessToken()
  // access token doesn't exist or was expired, grab a new one
  if (refreshToken && !accessToken) createAccessToken(refreshToken)
}
