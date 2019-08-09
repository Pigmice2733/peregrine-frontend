export const idbPromise = <T>(request: IDBRequest<T>) =>
  new Promise<T>((resolve, reject) => {
    // eslint-disable-next-line caleb/unicorn/prefer-add-event-listener
    request.onerror = () =>
      reject(request.error && new Error(request.error.message))
    request.onsuccess = () => resolve(request.result)
  })
