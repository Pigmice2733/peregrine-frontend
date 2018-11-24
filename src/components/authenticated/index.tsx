import { h, Component } from 'preact'
import { getJWT, setJWT } from '@/auth'
import TextInput from '@/components/text-input'
import Card from '@/components/card'
import style from './style.css'
import { authenticate } from '@/api/authenticate'
import { Roles } from '@/api/user'

interface JWT {
  exp: number
  pigmiceRealm: number
  pigmiceRoles: Roles
  sub: string
}

interface Props {
  render: (data: { roles: Roles; userId: string }) => JSX.Element
}

interface State {
  username: string
  password: string
}

const parseJWT = (jwt: string) => {
  const payload = jwt.split('.', 2)[1]
  return JSON.parse(atob(payload)) as JWT
}

class WithAuth extends Component<Props, State> {
  state = {
    username: '',
    password: '',
  }

  updateUsername = (e: Event) =>
    this.setState({ username: (e.target as HTMLInputElement).value })

  updatePassword = (e: Event) =>
    this.setState({ password: (e.target as HTMLInputElement).value })

  onSubmit = async (e: Event) => {
    e.preventDefault()
    const { jwt } = await authenticate(this.state.username, this.state.password)
    setJWT(jwt)
    this.setState({ username: '', password: '' })
  }

  render({ render }: Props) {
    const jwt = getJWT()
    if (!jwt) {
      return (
        <Card class={style.login}>
          <form onSubmit={this.onSubmit}>
            <TextInput label="Username" onInput={this.updateUsername} />
            <TextInput
              name="password"
              label="Password"
              type="password"
              onInput={this.updatePassword}
            />
            <button>Submit</button>
          </form>
        </Card>
      )
    }
    const parsedJWT = parseJWT(jwt)
    return render({ roles: parsedJWT.pigmiceRoles, userId: parsedJWT.sub })
  }
}

export default WithAuth
