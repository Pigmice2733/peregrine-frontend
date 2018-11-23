const apiUrl =
  (process.env.PEREGRINE_API_URL ||
  (process.env.NODE_ENV === 'production' && process.env.BRANCH === 'master')
    ? 'https://api.peregrine.ga:8081'
    : 'https://edge.api.peregrine.ga:8081') + '/'

type PeregrineResponse<T> =
  | {
      data: Readonly<T>
    }
  | {
      error: string
    }

type HTTPMethodWithoutBody = 'GET' | 'DELETE'
type HTTPMethodWithBody = 'POST' | 'PUT' | 'PATCH'

export function request<T, D = T>(
  method: HTTPMethodWithoutBody,
  endpoint: string,
  postProcess?: (data: T) => D,
): Promise<D>
export function request<T, D = T>(
  method: HTTPMethodWithBody,
  endpoint: string,
  body?: any,
  postProcess?: (data: T) => D,
): Promise<D>
export function request<T, D = T>(
  method: HTTPMethodWithBody | HTTPMethodWithoutBody,
  endpoint: string,
  bodyOrPostprocess?: ((data: T) => D) | any,
  postProcess?: (data: T) => D,
): Promise<D> {
  const body =
    typeof bodyOrPostprocess === 'function'
      ? undefined
      : JSON.stringify(bodyOrPostprocess)
  const processor =
    postProcess ||
    (typeof bodyOrPostprocess === 'function' && bodyOrPostprocess)
  return fetch(apiUrl + endpoint, { method, body })
    .then(res => {
      if (res.ok) {
        return res.json() as Promise<PeregrineResponse<T>>
      }
      throw new Error(res.statusText)
    })
    .then(data => {
      if ('error' in data) {
        return Promise.reject(data.error)
      }
      return Promise.resolve(
        processor ? processor(data.data) : ((data.data as unknown) as D),
      )
    })
}
