const env = 'process' in globalThis ? process.env : import.meta.env

const isNetlify = env.NODE_ENV === 'production' && env.BRANCH

export const apiUrl =
  (env.PEREGRINE_API_URL ||
    (isNetlify ? '/api' : 'https://peregrinefrc.com/api')) + '/'
