import { h } from 'preact'
import Authenticated from '@/components/authenticated'

const Login = () => {
  const goBack = () => window.history.back()
  return <Authenticated render={goBack as () => h.JSX.Element} />
}

export default Login
