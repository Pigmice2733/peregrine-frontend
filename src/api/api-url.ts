export const apiUrl =
  (process.env.PEREGRINE_API_URL ||
    (process.env.NODE_ENV === 'production' && process.env.BRANCH === 'master'
      ? 'http://71.36.107.28'
      : 'http://71.36.107.28')) + '/'
