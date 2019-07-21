import { cleanup } from '@calebeby/preact-testing-library'
import fetch, { Response, Headers } from 'node-fetch'
import '@testing-library/jest-dom/extend-expect'
import 'fake-indexeddb/auto'
import { removeAccessToken, removeRefreshToken } from '@/jwt'

window.fetch = (fetch as unknown) as GlobalFetch['fetch']
;(window as any).Response = Response
;(window as any).Headers = Headers

afterEach(() => {
  cleanup()
  indexedDB.deleteDatabase('CACHE')
  removeAccessToken()
  removeRefreshToken()
  localStorage.clear()
  jest.restoreAllMocks()
})
