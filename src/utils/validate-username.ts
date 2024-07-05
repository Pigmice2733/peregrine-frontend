export const validateUsername = (username: string) => {
  const regexTest = /^[a-z\d]+$/i
  if (regexTest.exec(username)) return false
  return true
}
