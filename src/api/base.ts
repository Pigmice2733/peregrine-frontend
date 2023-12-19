import { apiUrl } from '@/api/api-url'
import { removeAccessToken, getWorkingJWT } from '@/jwt'
import { HTTPMethod } from '@/utils/http-method'
import { CancellablePromise } from '@/utils/cancellable-promise'

type QueryParams =
  | { [key: string]: string | number | undefined | boolean }
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

interface ErrorData {
  error: string
}

export const request = <Expected>(
  method: HTTPMethod,
  endpoint: string,
  params?: QueryParams,
  body?: any,
) =>
  CancellablePromise.wrapAsync(async (onCancel) => {
    const controller = new AbortController()
    const signal = controller.signal

    onCancel(() => controller.abort())
    const jwt = await getWorkingJWT()
    const resp = await fetch(apiUrl + endpoint + qs(params), {
      method,
      body: JSON.stringify(body),
      headers: jwt ? { Authorization: `Bearer ${jwt.raw}` } : {},
      signal,
    })

    const text = await resp.text()

    const parsed =
      resp.headers.get('Content-Type') === 'application/json' && text !== ''
        ? (JSON.parse(text) as Expected | ErrorData)
        : ((text as unknown) as Expected | ErrorData)

    if (resp.ok) {
      return parsed as Expected
    }
    if (resp.status === 401) removeAccessToken()

    if (typeof parsed === 'string') {
      // eslint-disable-next-line caleb/unicorn/prefer-type-error
      throw new Error(parsed)
    }

    const error = new Error((parsed as ErrorData).error)
    Object.assign(error, parsed)

    throw error
  })
