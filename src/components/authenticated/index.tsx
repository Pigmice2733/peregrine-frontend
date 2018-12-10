import { h, Component } from 'preact'
import { getJWT, setJWT } from '@/jwt'
import TextInput from '@/components/text-input'
import Card from '@/components/card'
import style from './style.css'
import { authenticate } from '@/api/authenticate'
import { Roles } from '@/api/user'
import Page from '../page'
import Button from '../button'
import Alert from '../alert'

interface Props {
  render: (data: { roles: Roles; userId: string }) => JSX.Element
  label?: string
}

interface State {
  username: string
  password: string
  invalid: boolean
  loading: boolean
}

class Authenticted extends Component<Props, State> {
  state = {
    username: '',
    password: '',
    invalid: false,
    loading: false,
  }

  updateUsername = (e: Event) =>
    this.setState({ username: (e.target as HTMLInputElement).value })

  updatePassword = (e: Event) =>
    this.setState({ password: (e.target as HTMLInputElement).value })

  onSubmit = async (e: Event) => {
    e.preventDefault()
    this.setState({ loading: true, invalid: false })
    try {
      const { jwt } = await authenticate(
        this.state.username,
        this.state.password,
      )
      setJWT(jwt)
      this.setState({ username: '', password: '' })
    } catch (error) {
      if (error.match(/password/i)) {
        this.setState({ invalid: true })
      }
    }
    this.setState({ loading: false })
  }

  render({ render, label }: Props, { invalid, loading }: State) {
    const jwt = getJWT()
    if (!jwt) {
      return (
        <Page name={label || 'Log In'} back={() => window.history.back()}>
          <div class={style.login}>
            <Card>
              <form onSubmit={this.onSubmit}>
                {invalid && <Alert>Invalid Username or Password</Alert>}
                <TextInput label="Username" onInput={this.updateUsername} />
                <TextInput
                  name="password"
                  label="Password"
                  type="password"
                  onInput={this.updatePassword}
                />
                <Button>{loading ? 'Submitting' : 'Submit'}</Button>
              </form>
            </Card>
          </div>
        </Page>
      )
    }
    return render({ roles: jwt.pigmiceRoles, userId: jwt.sub })
  }
}

export default Authenticted
