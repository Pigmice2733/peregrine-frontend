import chunks, { chunksHash } from 'chunks'

declare let self: ServiceWorkerGlobalScope
export {}

const chunksCacheKey = chunksHash
const fontsCacheKey = 'fonts'

const cachePromise = caches.open(chunksCacheKey)
const fontsCachePromise = caches.open(fontsCacheKey)

// we are using /index.html instead of / so that it doesn't include h2 pushes because those depend on the route
const root = '/index.html'

const urlInWhitelist = (whitelist: string[], url: string) =>
  whitelist.some((cachePath) => new URL(cachePath, location.href).href === url)

const setupCache = async () => {
  const cache = await cachePromise
  const cacheItems: string[] = [...chunks, root, '/style.css']
  await cache.addAll(cacheItems)
  ;(await cache.keys()).forEach((req) => {
    if (!urlInWhitelist(cacheItems, req.url)) cache.delete(req)
  })
}

self.addEventListener('install', function (event) {
  event.waitUntil(setupCache())
  // If there is not an existing service worker installed
  // And the browser supports skipWaiting, call skipWaiting
  if (!self.registration.installing) {
    self.skipWaiting()
  }
})

// When the new SW activates, delete any old caches
self.addEventListener('activate', () => {
  caches.keys().then((cacheKeys) =>
    cacheKeys.forEach((cacheKey) => {
      if (cacheKey !== chunksCacheKey && cacheKey !== fontsCacheKey) {
        caches.delete(cacheKey)
      }
    }),
  )
})

const handleGETRequest = async (request: Request): Promise<Response> => {
  const cache = await cachePromise
  return (await cache.match(request)) || fetch(request, { mode: 'same-origin' })
}

const handleFontsRequest = async (request: Request) => {
  const fontsCache = await fontsCachePromise
  const cacheMatch = await fontsCache.match(request)
  if (cacheMatch) return cacheMatch
  return fetch(request).then((res) => {
    const cacheRes = res.clone()
    fontsCache.put(request, cacheRes)
    return res
  })
}

self.addEventListener('fetch', function (event) {
  const { request } = event
  const { url } = request
  if (request.mode === 'navigate') {
    return navigator.onLine
      ? null // Fall back to network
      : event.respondWith(caches.match(root) as Promise<Response>)
  }
  if (/fonts\.gstatic/.exec(url)) {
    return event.respondWith(handleFontsRequest(request))
  }
  const parsedUrl = new URL(request.url)
  if (
    request.method === 'GET' &&
    parsedUrl.origin === location.origin &&
    !parsedUrl.pathname.startsWith('/api')
  ) {
    // only handles requests from this domain
    return event.respondWith(handleGETRequest(request))
  }
})
