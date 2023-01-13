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