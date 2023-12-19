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
import { Realm } from '@/api/realm'

const signUpStyle = css`
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

const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [realmId, setRealmId] = useState<number | undefined>(undefined)
  const realms = usePromise(getRealms) || []
  const emitError = useErrorEmitter()

  const onSubmit = (e: Event) => {
    e.preventDefault()
    if (realmId === undefined) return
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
      {(isValid) => (
        <>
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
          <Dropdown<Realm>
            value={realms.find((r) => r.id === realmId)}
            emptyLabel="Select a realm"
            class={dropdownClass}
            options={realms}
            required
            onChange={(v) => setRealmId(v.id)}
            getKey={(v) => v.id}
            getText={(v) => v.name}
          />
          <Button disabled={isLoading || !isValid}>
            {isLoading ? 'Signing Up' : 'Sign Up'}
          </Button>
        </>
      )}
    </Form>
  )
}

const SignUp = () => (
  <Page name="Sign Up" back={() => window.history.back()}>
    <div class={signUpStyle}>
      <Card class={cardStyle}>
        <ErrorBoundary>
          <SignUpForm />
        </ErrorBoundary>
      </Card>
    </div>
  </Page>
)

export default SignUp
