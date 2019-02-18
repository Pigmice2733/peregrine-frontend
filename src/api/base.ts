import { getJWT } from '@/jwt'

const apiUrl =
  (process.env.PEREGRINE_API_URL ||
    (process.env.NODE_ENV === 'production' && process.env.BRANCH === 'master'
      ? 'https://api.peregrine.ga:8081'
      : 'https://edge.api.peregrine.ga:8081')) + '/'

const qs = (
  q: { [key: string]: string | number | undefined } | null | undefined,
) => {
  if (!q) return ''
  const v = Object.entries(q)
    .filter(([_key, val]) => val !== undefined)
    .map(([key, val]) => `${key}=${val}`)
    .join('&')
  return v ? `?${v}` : ''
}

export const request = async <T extends any>(
  method: 'GET' | 'DELETE' | 'POST' | 'PUT' | 'PATCH',
  endpoint: string,
  params?: { [key: string]: string | number | undefined } | null,
  body?: any,
  notAuthenticated?: true,
) => {
  const jwt = notAuthenticated ? false : await getJWT()
  const resp = await fetch(apiUrl + endpoint + qs(params), {
    method,
    body: JSON.stringify(body),
    headers: jwt ? { Authorization: `Bearer ${jwt.raw}` } : {},
  })

  const contentType = resp.headers.get('Content-Type')
  if (resp.ok) {
    if (contentType === 'application/json') {
      return resp.json() as Promise<T>
    }

    throw new Error('got unexpected Content-Type: ' + contentType)
  } else if (contentType === 'application/json') {
    throw new Error((await resp.json()).error)
  } else {
    throw new Error(await resp.text())
  }
}
