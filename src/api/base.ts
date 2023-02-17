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

export class NetworkError extends Error {
  name = 'NetworkError'
}

export class ServerError extends Error {
  name = 'ServerError'
  statusCode: number
  constructor(message: string, code: number) {
    super(message)
    this.statusCode = code
  }
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
    let resp: Response
    try {
      resp = await fetch(apiUrl + endpoint + qs(params), {
        method,
        body: JSON.stringify(body),
        headers: jwt ? { Authorization: `Bearer ${jwt.raw}` } : {},
        signal,
      })
    } catch (error: any) {
      throw new NetworkError(error.message)
    }

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
      throw new ServerError(
        `${resp.status} from server: ${parsed}`,
        resp.status,
      )
    }

    throw new ServerError((parsed as ErrorData).error, resp.status)
  })
