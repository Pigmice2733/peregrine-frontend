import { h } from 'preact'
import Authenticated from '@/components/authenticated'

const goBack = () => window.history.back()

const Login = () => {
  return <Authenticated render={goBack as () => h.JSX.Element} />
}

export default Login
