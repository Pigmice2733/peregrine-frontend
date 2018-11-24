const apiUrl =
  (process.env.PEREGRINE_API_URL ||
  (process.env.NODE_ENV === 'production' && process.env.BRANCH === 'master')
    ? 'https://api.peregrine.ga:8081'
    : 'https://edge.api.peregrine.ga:8081') + '/'

type PeregrineResponse<T> = Readonly<{ data: T } | { error: string }>

const qs = (
  q: { [key: string]: string | number | undefined } | null | undefined,
) => {
  if (!q) return ''
  return Object.entries(q)
    .map(([key, val]) => `${key}=${val}`)
    .filter(([_key, val]) => val !== undefined)
    .join('&')
}

export const request = <T extends any>(
  method: 'GET' | 'DELETE' | 'POST' | 'PUT' | 'PATCH',
  endpoint: string,
  params?: { [key: string]: string | number | undefined } | null,
  body?: any,
) =>
  fetch(apiUrl + endpoint + qs(params), { method, body })
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
      return (data.data as unknown) as Promise<T>
    })
