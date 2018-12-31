import { getJWT } from '@/jwt'

const apiUrl =
  (process.env.PEREGRINE_API_URL ||
    (process.env.NODE_ENV === 'production' && process.env.BRANCH === 'master'
      ? 'https://api.peregrine.ga:8081'
      : 'https://edge.api.peregrine.ga:8081')) + '/'

type PeregrineResponse<T> = Readonly<{ data: T } | { error: string }>

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
  const text = await fetch(apiUrl + endpoint + qs(params), {
    method,
    body: JSON.stringify(body),
    headers: jwt ? { Authorization: `Bearer ${jwt.raw}` } : {},
  }).then(d => d.text())
  try {
    const data = JSON.parse(text) as PeregrineResponse<T>
    if ('error' in data) {
      throw new Error(data.error)
    }

    return data.data
  } catch (error) {
    throw new Error(text)
  }
}
