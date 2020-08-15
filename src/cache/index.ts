import { idbPromise } from '@/utils/idb-promise'

const DB_NAME = 'CACHE'
const DB_VERSION = 4

const EVENT_STORE = 'events'
const MATCH_STORE = 'matches'
const SCHEMA_STORE = 'schemas'

const initDB = (db: IDBDatabase) => {
  if (!db.objectStoreNames.contains(EVENT_STORE))
    db.createObjectStore(EVENT_STORE)
  if (!db.objectStoreNames.contains(MATCH_STORE))
    db.createObjectStore(MATCH_STORE)
  if (!db.objectStoreNames.contains(SCHEMA_STORE))
    db.createObjectStore(SCHEMA_STORE)
}

let db: IDBDatabase | undefined

const getDB = () => {
  if (db) return Promise.resolve(db)
  const request = indexedDB.open(DB_NAME, DB_VERSION)
  request.onupgradeneeded = () => initDB(request.result)
  const requestPromise = idbPromise(request)
  requestPromise.then(() => {
    request.result.addEventListener('error', (errorEvent) => {
      throw new Error(
        ((errorEvent.target as unknown) as { error: string }).error,
      )
    })
    db = request.result
  })
  return requestPromise
}

export const transaction = async <ResolvedResult = void>(
  storeName: string,
  handler: (
    store: IDBObjectStore,
  ) =>
    | Promise<ResolvedResult | IDBRequest<ResolvedResult>>
    | (ResolvedResult | IDBRequest<ResolvedResult>),
  transactionType: IDBTransactionMode = 'readonly',
) => {
  const tx = (await getDB()).transaction(storeName, transactionType)
  const store = tx.objectStore(storeName)
  const handlerResult = await handler(store)
  const data =
    handlerResult instanceof IDBRequest
      ? idbPromise(handlerResult)
      : handlerResult
  // wait for transaction to finish
  await new Promise((resolve) => (tx.oncomplete = resolve as () => void))
  return data
}
