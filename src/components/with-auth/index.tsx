import { h, Component } from 'preact'
import { getJWT, setJWT } from '@/auth'
import TextInput from '@/components/text-input'
import Card from '@/components/card'
import style from './style.css'
import { authenticate } from '@/api'

interface Props {
  render: (data: { username: string }) => JSX.Element
}

interface State {
  username: string
  password: string
}

const parseJWT = (jwt: string) => {
  const payload = jwt.split('.', 2)[1]
  return atob(payload)
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

  onSubmit = async e => {
    e.preventDefault()
    const res = await authenticate(this.state.username, this.state.password)
    if (!('data' in res)) return
    const { jwt } = res.data
    console.log(jwt)
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
    console.log(jwt)
    console.log(parseJWT(jwt))
    return render({ username: 'cale' })
  }
}

export default WithAuth
