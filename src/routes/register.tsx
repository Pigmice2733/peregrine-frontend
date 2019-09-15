import { h, Fragment } from 'preact'
import TextInput from '@/components/text-input'
import Card from '@/components/card'
import Page from '@/components/page'
import { createUser } from '@/api/user/create-user'
import Button from '@/components/button'
import {
  minUsernameLength,
  maxUsernameLength,
  minPasswordLength,
  maxPasswordLength,
} from '@/constants'
import { useState } from 'preact/hooks'
import { css } from 'linaria'
import { Form } from '@/components/form'
import { Dropdown } from '@/components/dropdown'
import { getRealms } from '@/api/realm/get-realms'
import { usePromise } from '@/utils/use-promise'
import { ErrorBoundary, useErrorEmitter } from '@/components/error-boundary'
import { authenticate } from '@/api/authenticate'
import { route } from '@/router'

const registerStyle = css`
  padding: 1.5rem;
`

const cardStyle = css`
  padding: 1.5rem 2rem;
  width: 20rem;
  margin-left: auto;
  margin-right: auto;
  & > * {
    margin-left: 0;
    margin-right: 0;
  }
`

const dropdownClass = css`
  padding: 0.4rem;
`

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [realmId, setRealmId] = useState(1)
  const realms = usePromise(getRealms) || []
  const emitError = useErrorEmitter()

  const onSubmit = (e: Event) => {
    e.preventDefault()
    setIsLoading(true)
    createUser({
      username,
      password,
      firstName,
      lastName,
      realmId,
      roles: { isAdmin: false, isVerified: false, isSuperAdmin: false },
      stars: [],
    })
      .then(() => authenticate(username, password))
      .then(() => route('/'))
      .catch(emitError)
      .finally(() => setIsLoading(false))
  }

  return (
    <Form onSubmit={onSubmit}>
      {isValid => (
        <Fragment>
          <TextInput label="First Name" onInput={setFirstName} required />
          <TextInput label="Last Name" onInput={setLastName} required />
          <TextInput
            label="Username"
            required
            onInput={setUsername}
            minLength={minUsernameLength}
            maxLength={maxUsernameLength}
          />
          <TextInput
            name="password"
            label="Password"
            type="password"
            required
            onInput={setPassword}
            minLength={minPasswordLength}
            maxLength={maxPasswordLength}
          />
          <Dropdown
            class={dropdownClass}
            options={realms}
            onChange={v => {
              setRealmId(v.id)
            }}
            getKey={v => v.id}
            getText={v => v.name}
          />
          <Button disabled={isLoading || !isValid}>
            {isLoading ? 'Submitting' : 'Submit'}
          </Button>
        </Fragment>
      )}
    </Form>
  )
}

const Register = () => (
  <Page name="Register" back={() => window.history.back()}>
    <div class={registerStyle}>
      <Card class={cardStyle}>
        <ErrorBoundary>
          <RegisterForm />
        </ErrorBoundary>
      </Card>
    </div>
  </Page>
)

export default Register
