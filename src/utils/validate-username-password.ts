export const validateUsernamePassword = (
  username: string,
  password: string,
) => {
  const regexTest = new RegExp(/^\w+$/gi)
  if (regexTest.test(username) && regexTest.test(password)) return true
  return false
}
