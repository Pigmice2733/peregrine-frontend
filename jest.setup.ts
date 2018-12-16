import { cleanup } from 'preact-testing-library'
import fetch, { Response } from 'node-fetch'

window.fetch = (fetch as unknown) as GlobalFetch['fetch']
;(window as any).Response = Response

afterEach(cleanup)
