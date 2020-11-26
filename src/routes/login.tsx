import Authenticated from '@/components/authenticated'
import { decode } from 'qss'

const goBack = () => {
  window.location.href = decodeURIComponent(
    decode(window.location.search.slice(1)).from || '/',
  )
}

const Login = () => {
  return <Authenticated render={goBack as () => JSX.Element} />
}

export default Login
