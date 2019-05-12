export const apiUrl =
  (process.env.PEREGRINE_API_URL ||
    (process.env.NODE_ENV === 'production' && process.env.BRANCH === 'master'
      ? 'https://api.peregrine.ga'
      : 'https://edge.api.peregrine.ga')) + '/'
