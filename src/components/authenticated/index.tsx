import { h, JSX } from 'preact'
import { JWT, getWorkingJWT } from '@/jwt'
import TextInput from '@/components/text-input'
import Card from '@/components/card'
import { authenticate } from '@/api/authenticate'
import Page from '../page'
import Button from '../button'
import { css } from 'linaria'
import { useState, useEffect } from 'preact/hooks'
import { Roles } from '@/api/user'
import {
  minUsernameLength,
  maxUsernameLength,
  minPasswordLength,
  maxPasswordLength,
} from '@/constants'
import { Form } from '@/components/form'
import { ErrorBoundary, useErrorEmitter } from '../error-boundary'

const loginStyle = css`
  padding: 1.5rem;
`

const cardStyle = css`
  margin-left: auto;
  margin-right: auto;
  padding: 1.5rem 2rem;
  width: 17rem;
  > * {
    margin-left: 0;
    margin-right: auto;
  }
`

interface Props {
  render: (roles: Roles) => JSX.Element
  label?: string
}

const LoginForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const emitError = useErrorEmitter()

  const onSubmit = (e: Event) => {
    e.preventDefault()
    setIsLoading(true)
    authenticate(username, password)
      .then(() => {
        setUsername('')
        setPassword('')
        onSuccess()
      })
      .catch((error: Error) => {
        if (error.message.match(/unauthorized/i)) {
          emitError(new Error('Incorrect username or password'))
        } else {
          emitError(error)
        }
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <Form onSubmit={onSubmit}>
      <TextInput
        key="username"
        label="Username"
        onInput={setUsername}
        minLength={minUsernameLength}
        maxLength={maxUsernameLength}
      />
      <TextInput
        key="password"
        name="password"
        label="Password"
        type="password"
        onInput={setPassword}
        minLength={minPasswordLength}
        maxLength={maxPasswordLength}
      />
      <Button disabled={isLoading}>
        {isLoading ? 'Submitting' : 'Submit'}
      </Button>
    </Form>
  )
}

const Authenticated = ({ label, render }: Props) => {
  // undefined means we don't know if user has a token
  // null means user has no token
  const [jwt, setJWT] = useState<JWT | null | undefined>(undefined)

  const checkForWorkingJWT = () => {
    getWorkingJWT().then(setJWT)
  }

  useEffect(checkForWorkingJWT, [])

  if (!jwt) {
    return (
      <Page name={label || 'Log In'} back={() => window.history.back()}>
        {/* Don't flash the login page if we don't yet know if there is a jwt */}
        {jwt === null ? (
          <div class={loginStyle}>
            <Card class={cardStyle}>
              <ErrorBoundary>
                <LoginForm onSuccess={checkForWorkingJWT} />
              </ErrorBoundary>
            </Card>
          </div>
        ) : null}
      </Page>
    )
  }

  return render(jwt.pigmiceRoles)
}

export default Authenticated
