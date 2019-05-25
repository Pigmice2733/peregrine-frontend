import { apiUrl } from '@/api/api-url'
import { removeAccessToken, getWorkingJWT } from '@/jwt'
import { HTTPMethod } from '@/utils/httpMethod'

type QueryParams =
  | { [key: string]: string | number | undefined }
  | null
  | undefined

const qs = (q: QueryParams) => {
  if (!q) return ''
  const v = Object.entries(q)
    .filter(([, val]) => val !== undefined)
    .map(([key, val]) => `${key}=${val}`)
    .join('&')
  return v ? `?${v}` : ''
}

export const request = async <T extends any>(
  method: HTTPMethod,
  endpoint: string,
  params?: QueryParams,
  body?: any,
) => {
  const jwt = await getWorkingJWT()
  const resp = await fetch(apiUrl + endpoint + qs(params), {
    method,
    body: JSON.stringify(body),
    headers: jwt ? { Authorization: `Bearer ${jwt.raw}` } : {},
  })

  const text = await resp.text()

  const parsed =
    resp.headers.get('Content-Type') === 'application/json' && text !== ''
      ? (JSON.parse(text) as T)
      : ((text as unknown) as T)

  if (resp.ok) {
    return parsed
  }
  if (resp.status === 401) removeAccessToken()

  throw new Error(typeof parsed === 'string' ? parsed : parsed.error)
}
