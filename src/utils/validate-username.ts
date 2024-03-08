import { createAlert } from '@/router'
import { AlertType } from '@/components/alert'

export const validateUsername = (username: string) => {
  const regexTest = /^[a-z\d]+$/i
  if (regexTest.exec(username)) return false
  createAlert({
    type: AlertType.Error,
    message: 'Username may only have letters and numbers.',
  })
  return true
}
