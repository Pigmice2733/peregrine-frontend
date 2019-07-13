declare var self: ServiceWorkerGlobalScope
export {}

const cachePromise = caches.open('v1')

const populateCache = async () => {
  const cache = await cachePromise
  const chunks: string[] = await fetch('/chunks.json').then(d => d.json())
  await cache.addAll([...chunks, '/'])
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
