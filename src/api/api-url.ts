const isNetlify =
  import.meta.env.NODE_ENV === 'production' && process.env.BRANCH

export const apiUrl =
  (import.meta.env.PEREGRINE_API_URL ||
    (isNetlify ? '/api' : 'https://peregrinefrc.com/api')) + '/'
