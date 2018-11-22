type PeregrineResponse<T> =
  | {
      data: Readonly<T>
    }
  | {
      error: string
    }

const apiUrl =
  (process.env.PEREGRINE_API_URL
    ? process.env.PEREGRINE_API_URL
    : process.env.NODE_ENV === 'production' && process.env.BRANCH === 'master'
    ? 'https://api.peregrine.ga:8081'
    : 'https://edge.api.peregrine.ga:8081') + '/'

const processResponse = <T extends any>(
  d: PeregrineResponse<T>,
): Promise<T> => {
  if ('error' in d) {
    return Promise.reject(d.error)
  }
  return Promise.resolve(d.data)
}

// Webhook but only for ranking points and match score

export const getRequest = <T extends any>(path: string) =>
  fetch(apiUrl + path)
    .then(d => d.json() as Promise<PeregrineResponse<T>>)
    .then(processResponse)

export const deleteRequest = <T extends any>(
  path: string,
): Promise<PeregrineResponse<T>> => fetch(apiUrl + path).then(d => d.json())

export const putRequest = <T extends any>(
  path: string,
  body: any,
): Promise<PeregrineResponse<T>> =>
  fetch(apiUrl + path, { body }).then(d => d.json())

export const patchRequest = <T extends any>(
  path: string,
  body: any,
): Promise<PeregrineResponse<T>> =>
  fetch(apiUrl + path, { body }).then(d => d.json())

export const postRequest = <T extends any>(
  path: string,
  body: any,
): Promise<PeregrineResponse<T>> =>
  fetch(apiUrl + path, { body }).then(d => d.json())
