import { logout } from '@/jwt'

const goBack = () => window.history.back()

const Logout = () => {
  logout()
  goBack()
  return
}

export default Logout
