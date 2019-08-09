export const idbPromise = <T>(request: IDBRequest<T>) =>
  new Promise<T>((resolve, reject) => {
    // eslint-disable-next-line caleb/unicorn/prefer-add-event-listener
    request.onerror = () => reject(new Error(request.error))
    request.onsuccess = () => resolve(request.result)
  })
