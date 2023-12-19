import Authenticated from '@/components/authenticated'
import { decode } from 'qss'
import { route } from '@/router'

const goBack = () => {
  route(decode(window.location.search.slice(1)).from || '/')
}

const Login = () => {
  return <Authenticated render={goBack as () => JSX.Element} />
}

export default Login
