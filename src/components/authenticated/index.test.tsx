import { render, fireEvent, waitFor } from '@testing-library/preact'
import Authenticated from '.'
import { mockFetch } from '@/utils/mock-fetch'

const createToken = (data: any) => `asdf.${btoa(JSON.stringify(data))}.asdf`

test('renders login form', async () => {
  mockFetch({
    '/authenticate': {
      refreshToken: createToken({ peregrineRoles: { foo: true } }),
      accessToken: createToken({ peregrineRoles: { foo: true } }),
    },
  })
  const container = render(
    <Authenticated
      render={(roles) => (
        <h1>{`logged in with roles: ${JSON.stringify(roles)}`}</h1>
      )}
    />,
  )
  // wait for form to appear
  expect(
    await container.findByText(/log in/i, { selector: 'button' }),
  ).toBeDisabled()
  fireEvent.input(container.getByLabelText(/username/i), {
    target: { value: 'username' },
  })
  fireEvent.input(container.getByLabelText(/password/i), {
    target: { value: 'password' },
  })
  expect(
    await container.findByText(/log in/i, { selector: 'button' }),
  ).not.toBeDisabled()
  fireEvent.click(container.getByText(/log in/i, { selector: 'button' }))
  // check that the form submission went through
  await waitFor(() =>
    expect(window.fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/authenticate$/),
      {
        body: '{"username":"username","password":"password"}',
        headers: {},
        method: 'POST',
        signal: expect.any(AbortSignal),
      },
    ),
  )
  container.getByText('logged in with roles: {"foo":true}')
})
test('login form accepts only alphanumeric characters', async () => {
  mockFetch({
    '/authenticate': {
      refreshToken: createToken({ peregrineRoles: { foo: true } }),
      accessToken: createToken({ peregrineRoles: { foo: true } }),
    },
  })
  const container = render(
    <Authenticated
      render={(roles) => (
        <h1>{`logged in with roles: ${JSON.stringify(roles)}`}</h1>
      )}
    />,
  )
  // wait for form to appear
  expect(
    await container.findByText(/log in/i, { selector: 'button' }),
  ).toBeDisabled()
  fireEvent.input(container.getByLabelText(/username/i), {
    target: { value: 'user_! name' },
  })
  fireEvent.input(container.getByLabelText(/password/i), {
    target: { value: 'pass_! word' },
  })
  expect(
    await container.findByText(/log in/i, { selector: 'button' }),
  ).not.toBeDisabled()
  fireEvent.click(container.getByText(/log in/i, { selector: 'button' }))
  // checks that alert gets created
  container.getByText(
    'Username and password may only have letters and numbers.',
  )
})
