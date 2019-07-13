declare var self: ServiceWorkerGlobalScope
export {}

const chunksPromise = fetch('/chunks.json').then(d => d.json()) as Promise<
  string[]
>

const cachePromise = caches.open('v1')

const populateCache = async () => {
  const cache = await cachePromise
  await cache.addAll([...(await chunksPromise), '/'])
}

self.addEventListener('install', function(event) {
  self.skipWaiting()
  event.waitUntil(populateCache())
})

const handleGETRequest = async (request: Request): Promise<Response> => {
  const cache = await cachePromise
  const cacheResult = await cache.match(request)
  if (!cacheResult) return fetch(request)
  return cacheResult
}

self.addEventListener('fetch', function(event) {
  const { request } = event
  if (request.mode === 'navigate') {
    return event.respondWith(caches.match('/') as Promise<Response>)
  }
  if (request.method === 'GET') {
    return event.respondWith(handleGETRequest(request))
  }
})
