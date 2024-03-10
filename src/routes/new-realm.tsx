import { authenticate } from '@/api/authenticate'
import { createRealm } from '@/api/realm/create-realm'
import { getRealms } from '@/api/realm/get-realms'
import { createUser } from '@/api/user/create-user'
import { AlertType } from '@/components/alert'
import Button from '@/components/button'
import Card from '@/components/card'
import { useErrorEmitter, ErrorBoundary } from '@/components/error-boundary'
import { Form } from '@/components/form'
import Page from '@/components/page'
import TextInput from '@/components/text-input'
import {
  maxPasswordLength,
  maxRealmNameLength,
  maxUsernameLength,
  minPasswordLength,
  minUsernameLength,
} from '@/constants'
import { createAlert, route } from '@/router'
import { usePromise } from '@/utils/use-promise'
import { css } from '@linaria/core'
import { useState } from 'preact/hooks'

const contentStyle = css`
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

const textStyle = css`
  font-size: 0.85rem;
  color: var(--off-black);
  text-align: center;
`

const CreateRealmForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [realmName, setRealmName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const realms = usePromise(getRealms) || []
  const emitError = useErrorEmitter()
  let nameTaken = false

  const onSubmit = (e: Event) => {
    e.preventDefault()
    setIsLoading(true)
    nameTaken = false
    realms.forEach((realm) => {
      if (realm.name === realmName) {
        nameTaken = true
      }
    })
    // eslint-disable-next-line caleb/@typescript-eslint/no-unnecessary-condition
    if (nameTaken) {
      createAlert({
        type: AlertType.Error,
        message: 'A realm already exists with this name.',
      })
    } else {
      createRealm({ name: realmName, shareReports: true })
        .then((realm) =>
          createUser({
            username,
            password,
            firstName,
            lastName,
            realmId: realm,
            roles: { isAdmin: true, isVerified: true, isSuperAdmin: false },
            stars: [],
          }),
        )
        .then(() => authenticate(username, password))
        .then(() =>
          route('/', {
            type: AlertType.Success,
            message: 'Realm and account were created!',
          }),
        )
        .catch(emitError)
        .finally(() => setIsLoading(false))
    }
  }

  return (
    <Form onSubmit={onSubmit}>
      {(isValid) => (
        <>
          <div class={textStyle}>
            {
              'Enter a name for your new realm and account details for your own account. '
            }
            {
              'You will be made an admin automatically and can verify other users in your realm.'
            }
          </div>
          <TextInput
            label="Realm Name"
            required
            onInput={setRealmName}
            maxLength={maxRealmNameLength}
          />
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
          <Button disabled={isLoading || !isValid}>
            {isLoading ? 'Creating Realm' : 'Create New Realm'}
          </Button>
        </>
      )}
    </Form>
  )
}

const NewRealm = () => (
  <Page name="Create New Realm" back={() => window.history.back()}>
    <div class={contentStyle}>
      <Card class={cardStyle}>
        <ErrorBoundary>
          <CreateRealmForm />
        </ErrorBoundary>
      </Card>
    </div>
  </Page>
)

export default NewRealm
