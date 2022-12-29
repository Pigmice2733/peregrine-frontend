import Authenticated from 'src/components/authenticated'
import { decode } from 'qss'
import { route } from 'src/router'

const goBack = () => {
  route(decode(window.location.search.slice(1)).from || '/')
}

const Login = () => {
  return <Authenticated render={goBack as () => JSX.Element} />
}

export default Login
