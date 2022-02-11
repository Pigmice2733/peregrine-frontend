import { useJWT } from '@/jwt'
import TextInput from '@/components/text-input'
import Card from '@/components/card'
import { authenticate } from '@/api/authenticate'
import Page from '../page'
import Button from '../button'
import { css } from 'linaria'
import { useState, useRef } from 'preact/hooks'
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
  display: flex;
  flex-direction: column;
  align-items: center;
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

const signUpStyle = css`
  width: 6rem;
  margin-top: 1rem;
`

interface Props {
  render: (roles: Roles) => JSX.Element
  label?: string
}

const LoginForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const formRef = useRef<HTMLFormElement>()
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
        if (/unauthorized/i.exec(error.message)) {
          emitError(new Error('Incorrect username or password'))
        } else {
          emitError(error)
        }
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <Form onSubmit={onSubmit} ref={formRef}>
      {(isValid) => (
        <>
          <TextInput
            required
            label="Username"
            onInput={setUsername}
            minLength={minUsernameLength}
            maxLength={maxUsernameLength}
          />
          <TextInput
            required
            name="password"
            label="Password"
            type="password"
            onInput={setPassword}
            minLength={minPasswordLength}
            maxLength={maxPasswordLength}
          />
          <Button disabled={isLoading || !isValid}>
            {isLoading ? 'Logging In' : 'Log In'}
          </Button>
        </>
      )}
    </Form>
  )
}

const Authenticated = ({ label, render }: Props) => {
  const { jwt, checkForWorkingJWT } = useJWT()

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
            <Button href="/signup" flat class={signUpStyle}>
              Sign Up
            </Button>
          </div>
        ) : null}
      </Page>
    )
  }

  return render(jwt.peregrineRoles)
}

export default Authenticated
