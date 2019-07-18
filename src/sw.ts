import chunks from 'chunks'

declare var self: ServiceWorkerGlobalScope
export {}

const cachePromise = caches.open('v1')
const fontsCachePromise = caches.open('fonts')

// we are using /index.html instead of / so that it doesn't include h2 pushes because those depend on the route
const root = '/index.html'

const urlInWhitelist = (whitelist: string[], url: string) =>
  whitelist.some(cachePath => new URL(cachePath, location.href).href === url)

const setupCache = async () => {
  const cache = await cachePromise
  const cacheItems: string[] = [...chunks, root, '/style.css']
  await cache.addAll(cacheItems)
  ;(await cache.keys()).forEach(req => {
    if (!urlInWhitelist(cacheItems, req.url)) cache.delete(req)
  })
}

self.addEventListener('install', function(event) {
  self.skipWaiting()
  event.waitUntil(setupCache())
})

const handleGETRequest = async (request: Request): Promise<Response> => {
  const cache = await cachePromise
  const cacheResult = await cache.match(request)
  if (!cacheResult) return fetch(request)
  return cacheResult
}

const handleFontsRequest = async (request: Request) => {
  const fontsCache = await fontsCachePromise
  const cacheMatch = await fontsCache.match(request)
  if (cacheMatch) return cacheMatch
  return fetch(request).then(res => {
    const cacheRes = res.clone()
    fontsCache.put(request, cacheRes)
    return res
  })
}

self.addEventListener('fetch', function(event) {
  const { request } = event
  const { url } = request
  if (request.mode === 'navigate') {
    return navigator.onLine
      ? null // Fall back to network
      : event.respondWith(caches.match(root) as Promise<Response>)
  }
  if (url.match(/fonts\.gstatic/)) {
    return event.respondWith(handleFontsRequest(request))
  }
  if (
    request.method === 'GET' &&
    new URL(request.url).origin === location.origin
  ) {
    // only handles requests from this domain
    return event.respondWith(handleGETRequest(request))
  }
})
