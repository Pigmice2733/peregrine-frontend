import { h, Component } from 'preact'
import { getJWT, setJWT } from '@/jwt'
import TextInput from '@/components/text-input'
import Card from '@/components/card'
import style from './style.css'
import { authenticate } from '@/api/authenticate'
import { Roles } from '@/api/user'

interface Props {
  render: (data: { roles: Roles; userId: string }) => JSX.Element
}

interface State {
  username: string
  password: string
}

class Authenticted extends Component<Props, State> {
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
    return render({ roles: jwt.pigmiceRoles, userId: jwt.sub })
  }
}

export default Authenticted
