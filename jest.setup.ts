import { cleanup } from '@calebeby/preact-testing-library'
import fetch, { Response, Headers } from 'node-fetch'
import '@testing-library/jest-dom/extend-expect'
import 'fake-indexeddb/auto'
import { removeAccessToken, removeRefreshToken } from '@/jwt'

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
