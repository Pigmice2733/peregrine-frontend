import { createRealm } from '@/api/realm/create-realm'
import { getRealms } from '@/api/realm/get-realms'
import { AlertType } from '@/components/alert'
import Button from '@/components/button'
import Card from '@/components/card'
import { useErrorEmitter, ErrorBoundary } from '@/components/error-boundary'
import { Form } from '@/components/form'
import Page from '@/components/page'
import TextInput from '@/components/text-input'
import { maxRealmNameLength } from '@/constants'
import { createAlert, route } from '@/router'
import { usePromise } from '@/utils/use-promise'
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

const CreateRealmForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [realmName, setRealmName] = useState('')
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
      createRealm({ name: realmName, shareReports: false })
        .then(() =>
          route('/signup', {
            type: AlertType.Success,
            message: 'Realm was created!',
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
          <CreateRealmForm />
        </ErrorBoundary>
      </Card>
    </div>
  </Page>
)

export default NewRealm
