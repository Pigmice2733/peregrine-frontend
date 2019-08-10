import { idbPromise } from '@/utils/idb-promise'

const DB_NAME = 'CACHE'
const DB_VERSION = 2

const EVENT_STORE = 'events'
const MATCH_STORE = 'matches'

const initDB = (db: IDBDatabase) => {
  if (!db.objectStoreNames.contains(EVENT_STORE))
    db.createObjectStore(EVENT_STORE)
  if (!db.objectStoreNames.contains(MATCH_STORE))
    db.createObjectStore(MATCH_STORE)
}

const getDB = (dbName: string) => {
  const request = indexedDB.open(dbName, DB_VERSION)
  request.onupgradeneeded = () => initDB(request.result)
  const requestPromise = idbPromise(request)
  requestPromise.then(() => {
    request.result.addEventListener('error', errorEvent => {
      throw new Error(
        ((errorEvent.target as unknown) as { error: string }).error,
      )
    })
  })
  return requestPromise
}

const db = getDB(DB_NAME)

export const transaction = async <ResolvedResult = void>(
  storeName: string,
  handler: (
    store: IDBObjectStore,
  ) =>
    | Promise<ResolvedResult | IDBRequest<ResolvedResult>>
    | (ResolvedResult | IDBRequest<ResolvedResult>),
  transactionType: IDBTransactionMode = 'readonly',
) => {
  const tx = (await db).transaction(storeName, transactionType)
  const store = tx.objectStore(storeName)
  const handlerResult = await handler(store)
  const data =
    handlerResult instanceof IDBRequest
      ? idbPromise(handlerResult)
      : handlerResult
  // wait for transaction to finish
  await new Promise(resolve => (tx.oncomplete = resolve as () => {}))
  return data
}
