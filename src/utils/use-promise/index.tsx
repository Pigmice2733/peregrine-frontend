import { useState, useEffect } from 'preact/hooks'
import { useErrorEmitter } from '@/components/error-boundary'
import { CancellablePromise } from '@/utils/cancellable-promise'
import { NetworkError } from '@/api/base'

export const usePromise = <T extends any>(
  promiseCreator: () => Promise<T> | T,
  dependencies: any[] = [promiseCreator],
) => {
  const emitError = useErrorEmitter()
  const [val, setVal] = useState<T | undefined | Error | NetworkError>(
    undefined,
  )
  useEffect(() => {
    const cbResult = promiseCreator()
    if (!(cbResult instanceof Promise)) return setVal(cbResult)
    cbResult
      .then((v) => setVal(v))
      .catch((error) => {
        console.log('caught an error')
        emitError(error)
        // if (error instanceof Error) setVal(error)
        // else emitError(error)
      })
    return () => {
      if (cbResult instanceof CancellablePromise) cbResult.cancel()
      setVal(undefined)
    }
  }, [emitError, ...dependencies]) // eslint-disable-line caleb/react-hooks/exhaustive-deps
  return val
}
