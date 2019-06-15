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

const getDB = (dbName: string): Promise<IDBDatabase> =>
  new Promise(resolve => {
    const request = indexedDB.open(dbName, DB_VERSION)
    request.addEventListener('upgradeneeded', () => initDB(request.result))
    request.addEventListener('success', () => {
      request.result.addEventListener('error', errorEvent => {
        throw new Error(
          ((errorEvent.target as unknown) as { error: string }).error,
        )
      })
      resolve(request.result)
    })
  })

const db = getDB(DB_NAME)

export const transaction = <ResolvedResult = void>(
  storeName: string,
  handler: (
    store: IDBObjectStore,
  ) => Promise<IDBRequest<ResolvedResult>> | IDBRequest<ResolvedResult> | void,
  transactionType: IDBTransactionMode = 'readonly',
) =>
  db.then(resolvedDb => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<ResolvedResult>(async resolve => {
      const tx = resolvedDb.transaction(storeName, transactionType)
      const store = tx.objectStore(storeName)
      const handlerResult = await handler(store)
      if (handlerResult) {
        handlerResult.onsuccess = event => {
          const { result } = (event.target as unknown) as {
            result: ResolvedResult | undefined
          }
          if (result !== undefined) resolve(result)
        }
      } else {
        tx.oncomplete = () => resolve()
      }
    })
  })
