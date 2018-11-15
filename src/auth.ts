let jwt: string | null = null

export const getJWT = () => jwt || localStorage.getItem('jwt')

export const setJWT = (newJWT: string) => {
  jwt = newJWT
  localStorage.setItem('jwt', jwt)
}
