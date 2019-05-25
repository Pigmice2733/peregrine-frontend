const DB_NAME = 'CACHE'
const DB_VERSION = 1

const EVENT_STORE = 'events'

const initDB = (db: IDBDatabase) => {
  if (!db.objectStoreNames.contains(EVENT_STORE))
    db.createObjectStore(EVENT_STORE)
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

export const transaction = <T = void>(
  storeName: string,
  handler: (store: IDBObjectStore) => T extends void ? void : IDBRequest<T>,
  transactionType: IDBTransactionMode = 'readonly',
) =>
  db.then(
    resolvedDb =>
      new Promise<T>(resolve => {
        const tx = resolvedDb.transaction(storeName, transactionType)
        const handleResult = handler(tx.objectStore(storeName))
        if (handleResult) {
          ;(handleResult as IDBRequest<T>).onsuccess = event => {
            const { result } = (event.target as unknown) as { result: T }
            if (result !== undefined) resolve(result)
          }
        } else {
          tx.oncomplete = () => resolve()
        }
      }),
  )
