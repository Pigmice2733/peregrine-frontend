import { cleanup } from '@calebeby/preact-testing-library'
import fetch, { Response, Headers } from 'node-fetch'
import '@testing-library/jest-dom/extend-expect'
import 'fake-indexeddb/auto'
import { removeAccessToken, removeRefreshToken } from '@/jwt'

declare global {
  // eslint-disable-next-line caleb/@typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeChecked(): R
    }
  }
}

expect.extend({
  toBeChecked(received) {
    if (received.checked)
      return {
        message: () => `expected ${received} to not be checked`,
        pass: true,
      }

    return {
      message: () => `expected ${received} to be checked`,
      pass: false,
    }
  },
})

window.fetch = (fetch as unknown) as typeof window['fetch']
;(window as any).Response = Response
;(window as any).Headers = Headers

beforeEach(() => {
  jest.spyOn(window, 'fetch').mockImplementation((...args) => {
    console.warn('window.fetch is not mocked for this call', ...args)
    throw new Error('window.fetch must be mocked!')
  })
})

afterEach(() => {
  cleanup()
  indexedDB.deleteDatabase('CACHE')
  removeAccessToken()
  removeRefreshToken()
  localStorage.clear()
  jest.restoreAllMocks()
})
