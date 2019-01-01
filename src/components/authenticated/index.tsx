import { h, Component } from 'preact'
import { getJWT } from '@/jwt'
import TextInput from '@/components/text-input'
import Card from '@/components/card'
import style from './style.css'
import { authenticate } from '@/api/authenticate'
import Page from '../page'
import Button from '../button'
import Alert from '../alert'

const minUsernameLength = 4
const maxUsernameLength = 32
const minPasswordLength = 8
const maxPasswordLength = 128

interface Props {
  render: () => JSX.Element
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
      await authenticate(this.state.username, this.state.password)
      this.setState({ username: '', password: '' })
    } catch (error) {
      if (error.message.match(/unauthorized/i)) {
        return this.setState({ invalid: true, loading: false })
      }
      throw error
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
                <TextInput
                  label="Username"
                  onInput={this.updateUsername}
                  minLength={minUsernameLength}
                  maxLength={maxUsernameLength}
                />
                <TextInput
                  name="password"
                  label="Password"
                  type="password"
                  onInput={this.updatePassword}
                  minLength={minPasswordLength}
                  maxLength={maxPasswordLength}
                />
                <Button disabled={loading}>
                  {loading ? 'Submitting' : 'Submit'}
                </Button>
              </form>
            </Card>
          </div>
        </Page>
      )
    }
    return render()
  }
}

export default Authenticted
