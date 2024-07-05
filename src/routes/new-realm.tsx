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
  width: 30rem;
  margin-left: auto;
  margin-right: auto;

  & > * {
    margin-left: 0;
    margin-right: 0;
  }

  @media (max-width: 550px) {
    width: 20rem;
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
            realmId: realm.id,
            roles: { isAdmin: false, isVerified: false, isSuperAdmin: false },
            stars: [],
          }),
        )
        .then(() => authenticate(username, password))
        .then(() =>
          route('/', {
            type: AlertType.Success,
            message:
              'Realm and account were created! Remember to email alexv@pigmice.com to finish setting up your realm.',
          }),
        )
        .catch(emitError)
    }
    setIsLoading(false)
  }

  return (
    <Form onSubmit={onSubmit}>
      {(isValid) => (
        <>
          <div class={textStyle}>
            {`Enter a name for your new realm and account details for your own account. `}
            {`After you submit this form, you will need to finish setting up your realm so
              that you can add and verify your teammates. Send an email to `}
            <a href="mailto:alexv@pigmice.com">alexv@pigmice.com</a>
            {` and include the name of your realm and your username. You will be invited to
              a Slack channel where you can ask questions and get feedback.`}
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
