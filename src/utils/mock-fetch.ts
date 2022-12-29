const createResponse = (data: any) =>
  new Response(typeof data === 'string' ? data : JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  })

interface URLMap {
  [url: string]: any
}

const createHandler = (urls: URLMap) => async (
  req: RequestInfo,
  // eslint-disable-next-line caleb/@typescript-eslint/require-await
) => {
  const reqUrl = typeof req === 'string' ? req : req.url
  const matchingRoute = Object.entries(urls).reduce<any>(
    (matchingRoute, [url, handler]) => {
      // if we already found one, move on
      if (matchingRoute !== undefined) return matchingRoute
      // if it starts with / assume it is just the path
      if (url.startsWith('/') && reqUrl.endsWith(url)) return handler
      // otherwise match the whole url
      if (url === reqUrl) return handler
      return undefined
    },
    undefined,
  )
  if (matchingRoute === undefined)
    throw new Error(`Unrecognized parameters to fetch: ${reqUrl}`)

  return createResponse(matchingRoute)
}

export const mockFetch = (urls: URLMap) => {
  jest.spyOn(window, 'fetch').mockImplementation(createHandler(urls) as any)
}
