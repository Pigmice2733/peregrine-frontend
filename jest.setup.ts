import { cleanup } from 'preact-testing-library'
import fetch, { Response, Headers } from 'node-fetch'
import 'jest-dom/extend-expect'
import { setJWT } from '@/jwt'

window.fetch = (fetch as unknown) as GlobalFetch['fetch']
;(window as any).Response = Response
;(window as any).Headers = Headers

afterEach(cleanup)

afterEach(() => {
  setJWT((null as unknown) as string)
  localStorage.clear()
  jest.restoreAllMocks()
})
