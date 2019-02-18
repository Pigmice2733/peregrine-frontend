import { render, fireEvent, wait } from 'preact-testing-library'
import Authenticted from '.'
import { h } from 'preact'

const jwtBody = {
  exp: Date.now() / 1000 + 100,
  sub: 'name',
  pigmiceRoles: { admin: true },
}
const jwt = `asdf.${btoa(JSON.stringify(jwtBody))}.asdf`

test('renders login page then renders contents', async () => {
  const { getByLabelText, getByText } = render(
    <Authenticted render={() => <div>Rendered</div>} />,
  )
  const usernameInput = getByLabelText(/username/i) as HTMLInputElement

  usernameInput.value = 'name'
  fireEvent.input(usernameInput)

  const passwordInput = getByLabelText(/password/i) as HTMLInputElement

  passwordInput.value = 'pwd'
  fireEvent.input(passwordInput)

  jest.spyOn(window, 'fetch').mockImplementation(
    (url, options) =>
      new Promise(resolve => {
        expect(url).toMatch(/\/authenticate$/)
        expect(options).toEqual({
          body: '{"username":"name","password":"pwd"}',
          headers: {},
          method: 'POST',
        })
        resolve(
          new Response(JSON.stringify({ data: { accessToken: jwt } }), {
            headers: { 'Content-Type': 'application/json' },
          }),
        )
      }),
  )

  fireEvent.submit(getByText('Submit'))

  await wait(() => getByText('Rendered'))

  expect(window.fetch).toHaveBeenCalledTimes(1)

  expect(localStorage.getItem('jwt')).toEqual(jwt)
})

test('displays error for incorrect username/pw', async () => {
  const { getByLabelText, getByText } = render(
    <Authenticted render={() => <div>Rendered</div>} />,
  )
  const usernameInput = getByLabelText(/username/i) as HTMLInputElement

  usernameInput.value = 'name'
  fireEvent.input(usernameInput)

  const passwordInput = getByLabelText(/password/i) as HTMLInputElement

  passwordInput.value = 'incorrect'
  fireEvent.input(passwordInput)

  jest.spyOn(window, 'fetch').mockImplementation(
    (url, options) =>
      new Promise(resolve => {
        expect(url).toMatch(/\/authenticate$/)
        expect(options).toEqual({
          body: '{"username":"name","password":"incorrect"}',
          headers: {},
          method: 'POST',
        })
        resolve(
          new Response('Unauthorized', {
            status: 401,
            headers: { 'Content-Type': 'text/plain' },
          }),
        )
      }),
  )

  fireEvent.submit(getByText('Submit'))

  await wait(() => getByText(/invalid/i))

  expect(window.fetch).toHaveBeenCalledTimes(1)

  expect(localStorage.getItem('jwt')).toBeNull()
})

test('renders content directly with jwt in localstorage', () => {
  localStorage.setItem('jwt', jwt)
  const { getByText } = render(
    <Authenticted
      render={() => (
        <div>
          <h1>Roles</h1>
        </div>
      )}
    />,
  )

  getByText('Roles')
})

test('deletes expired jwt', async () => {
  const expiredJWTBody = { exp: Date.now() / 1000 - 100 }
  const expiredJWT = `asdf.${btoa(JSON.stringify(expiredJWTBody))}.asdf`
  localStorage.setItem('jwt', expiredJWT)
  const { getByText } = render(<Authenticted render={() => <h1>Hi</h1>} />)

  await wait(() => getByText('Submit'))

  expect(localStorage.getItem('jwt')).toBeNull()
})
