import { cleanup } from '@testing-library/preact'
import fetch, { Response, Headers } from 'node-fetch'
import '@testing-library/jest-dom/vitest'
import 'fake-indexeddb/auto'
import { removeAccessToken, removeRefreshToken } from '@/jwt'

window.fetch = (fetch as unknown) as typeof window['fetch']
;(window as any).Response = Response
;(window as any).Headers = Headers

beforeEach(() => {
  vi.spyOn(window, 'fetch').mockImplementation(
    (...args: Parameters<typeof window.fetch>) => {
      console.warn('window.fetch is not mocked for this call', ...args)
      throw new Error('window.fetch must be mocked!')
    },
  )
})

afterEach(() => {
  cleanup()
  indexedDB.deleteDatabase('CACHE')
  removeAccessToken()
  removeRefreshToken()
  localStorage.clear()
  vi.restoreAllMocks()
})
