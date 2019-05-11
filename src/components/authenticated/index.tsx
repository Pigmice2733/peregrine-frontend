import { h, Component, JSX } from 'preact'
import { getJWT, JWT } from '@/jwt'
import TextInput from '@/components/text-input'
import Card from '@/components/card'
import { authenticate } from '@/api/authenticate'
import Page from '../page'
import Button from '../button'
import Alert from '../alert'
import { css } from 'linaria'

const loginStyle = css`
  padding: 1.5rem;
`

const cardStyle = css`
  margin-left: auto;
  margin-right: auto;
  padding: 1.5rem 2rem;
  width: 15rem;
`

const formStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

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
  jwt?: JWT | void
}

class Authenticated extends Component<Props, State> {
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

  render({ render, label }: Props, { invalid, loading, jwt }: State) {
    if (jwt === undefined) {
      Promise.resolve<JWT | void>(getJWT()).then(j => {
        if (j) this.setState({ jwt: j })
      })
    }
    if (!jwt) {
      return (
        <Page name={label || 'Log In'} back={() => window.history.back()}>
          <div class={loginStyle}>
            <Card class={cardStyle}>
              <form onSubmit={this.onSubmit} class={formStyle}>
                {invalid && <Alert>Invalid Username or Password</Alert>}
                <TextInput
                  key="username"
                  label="Username"
                  onInput={this.updateUsername}
                  minLength={minUsernameLength}
                  maxLength={maxUsernameLength}
                />
                <TextInput
                  key="password"
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

export default Authenticated
