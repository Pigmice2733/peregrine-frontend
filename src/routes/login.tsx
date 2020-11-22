import Authenticated from '@/components/authenticated'

const useQuery = () => {
  return new URLSearchParams(window.location.search);
}

const goBack = () => {
  // eslint-disable-next-line caleb/react-hooks/rules-of-hooks
  window.location.href = decodeURIComponent(useQuery().get("from") || '');
}

const Login = () => {
  return <Authenticated render={goBack as () => JSX.Element} />
}

export default Login
