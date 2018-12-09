import { render, fireEvent, wait } from 'preact-testing-library'
import Authenticted from '.'
import { h } from 'preact'
import fetch, { Response } from 'node-fetch'
import { setJWT } from '@/jwt'

window.fetch = (fetch as unknown) as GlobalFetch['fetch']

const jwtBody = {
  exp: Date.now() / 1000 + 100,
  sub: 'name',
  pigmiceRoles: { admin: true },
}
const jwt = `asdf.${btoa(JSON.stringify(jwtBody))}.asdf`

afterEach(() => {
  jest.restoreAllMocks()
  setJWT((null as unknown) as string)
  localStorage.clear()
})

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
        resolve(new Response(JSON.stringify({ data: { jwt } })))
      }),
  )

  fireEvent.submit(getByText('Submit'))

  expect(window.fetch).toHaveBeenCalledTimes(1)

  await wait(() => getByText('Rendered'))

  expect(localStorage.getItem('jwt')).toEqual(jwt)
})

test('renders content directly with jwt in localstorage', () => {
  localStorage.setItem('jwt', jwt)
  const { getByText } = render(
    <Authenticted
      render={({ roles, userId }) => (
        <div>
          <h1>Roles</h1>
          <div>{JSON.stringify(roles)}</div>
          <h1>UserId - {userId}</h1>
        </div>
      )}
    />,
  )

  const rolesDiv = getByText('Roles').nextElementSibling as HTMLDivElement
  expect(rolesDiv.textContent).toMatchInlineSnapshot(`"{\\"admin\\":true}"`)

  expect(getByText(/userid/i).textContent).toEqual('UserId - name')
})

test('deletes expired jwt', async () => {
  const expiredJWTBody = { exp: Date.now() / 1000 - 100 }
  const expiredJWT = `asdf.${btoa(JSON.stringify(expiredJWTBody))}.asdf`
  localStorage.setItem('jwt', expiredJWT)
  const { getByText } = render(<Authenticted render={() => <h1>Hi</h1>} />)

  await wait(() => getByText('Submit'))

  expect(localStorage.getItem('jwt')).toBeNull()
})
