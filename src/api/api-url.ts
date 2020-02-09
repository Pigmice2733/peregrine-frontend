const PROD_URL = '/api'
const DEV_URL = PROD_URL

const isProd =
  process.env.NODE_ENV === 'production' && process.env.BRANCH === 'master'

export const apiUrl =
  (process.env.PEREGRINE_API_URL || (isProd ? PROD_URL : DEV_URL)) + '/'
