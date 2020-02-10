import { useState, useEffect } from 'preact/hooks'
import { useErrorEmitter } from '@/components/error-boundary'
import { CancellablePromise } from '@/utils/cancellable-promise'

export const usePromise = <T extends any>(
  promiseCreator: () => Promise<T> | T,
  dependencies: any[] = [promiseCreator],
) => {
  const emitError = useErrorEmitter()
  const [val, setVal] = useState<T | undefined>(undefined)
  useEffect(() => {
    const cbResult = promiseCreator()
    if (!(cbResult instanceof Promise)) return setVal(cbResult)
    cbResult.then(v => setVal(v)).catch(emitError)
    return () => {
      if (cbResult instanceof CancellablePromise) cbResult.cancel()
      setVal(undefined)
    }
  }, [emitError, ...dependencies]) // eslint-disable-line caleb/react-hooks/exhaustive-deps
  return val
}
