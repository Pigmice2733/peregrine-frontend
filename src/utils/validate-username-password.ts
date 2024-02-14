import { createAlert } from '@/router'
import { AlertType } from '@/components/alert'

export const validateUsernamePassword = (
  username: string,
  password: string,
) => {
  const regexTest = new RegExp(/^[a-z\d]+$/gi)
  if (regexTest.test(username) && regexTest.test(password)) return true
  createAlert({
    type: AlertType.Error,
    message: 'Username and password may only have letters and numbers.',
  })
  return false
}
