import { h, Component } from 'preact'
import TextInput from '@/components/text-input'
import Card from '@/components/card'
import Page from '@/components/page'
import { createUser } from '@/api/user/create-user'
import Button from '@/components/button'

const minUsernameLength = 4
const maxUsernameLength = 32
const minPasswordLength = 8
const maxPasswordLength = 128

interface State {
  username: string
  password: string
  loading: boolean
  firstName: string
  lastName: string
}

export default class Authenticated extends Component<{}, State> {
  state: State = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    loading: false,
  }

  updateField = (key: keyof State) => (e: Event) =>
    // @ts-ignore
    this.setState({ [key]: (e.target as HTMLInputElement).value })

  onSubmit = async (e: Event) => {
    e.preventDefault()
    this.setState({ loading: true })
    createUser({
      username: this.state.username,
      password: this.state.password,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      realmId: 1,
      roles: { isAdmin: false, isVerified: false, isSuperAdmin: false },
      stars: [],
    })
  }

  render(_: any, { loading }: State) {
    return (
      <Page name="Register" back={() => window.history.back()}>
        <div>
          <Card>
            <form onSubmit={this.onSubmit}>
              <TextInput
                label="First Name"
                onInput={this.updateField('firstName')}
              />
              <TextInput
                label="Last Name"
                onInput={this.updateField('lastName')}
              />
              <TextInput
                label="Username"
                onInput={this.updateField('username')}
                minLength={minUsernameLength}
                maxLength={maxUsernameLength}
              />
              <TextInput
                name="password"
                label="Password"
                type="password"
                onInput={this.updateField('password')}
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
}
