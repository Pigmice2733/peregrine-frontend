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

export const request = <T, D = T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  postProcess: (data: T) => D = d => (d as unknown) as D,
  body?: BodyInit,
): Promise<D> =>
  fetch(apiUrl + endpoint, { method, body })
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
      return Promise.resolve(postProcess(data.data))
    })
