export const apiUrl =
  (process.env.PEREGRINE_API_URL ||
    (process.env.NODE_ENV === 'production' && process.env.BRANCH === 'master'
      ? 'https://peregrinek8s.xyz'
      : 'https://peregrinek8s.xyz')) + '/'
