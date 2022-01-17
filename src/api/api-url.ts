const isNetlify = process.env.NODE_ENV === 'production' && process.env.BRANCH

export const apiUrl =
  (process.env.PEREGRINE_API_URL ||
    (isNetlify ? '/api' : 'https://peregrinefrc.com/api')) + '/'
