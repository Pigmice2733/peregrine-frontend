import { createRealm } from '@/api/realm/create-realm'
import Button from '@/components/button'
import Card from '@/components/card'
import { useErrorEmitter, ErrorBoundary } from '@/components/error-boundary'
import { Form } from '@/components/form'
import Page from '@/components/page'
import TextInput from '@/components/text-input'
import { maxRealmNameLength } from '@/constants'
import { route } from '@/router'
import { css } from 'linaria'
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

const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [realmName, setRealmName] = useState('')
  // const realms = usePromise(getRealms) || []
  const emitError = useErrorEmitter()

  const onSubmit = (e: Event) => {
    e.preventDefault()
    setIsLoading(true)
    createRealm({ name: realmName, shareReports: false })
      .then(() => route('/login'))
      .catch(emitError)
      .finally(() => setIsLoading(false))
  }

  return (
    <Form onSubmit={onSubmit}>
      {(isValid) => (
        <>
          <TextInput
            label="Realm Name"
            type="realmName"
            required
            onInput={setRealmName}
            maxLength={maxRealmNameLength}
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
          <SignUpForm />
        </ErrorBoundary>
      </Card>
    </div>
  </Page>
)

export default NewRealm
