import { useState, useEffect } from 'preact/hooks'
import { useErrorEmitter } from '@/components/error-boundary'

export const usePromise = <T extends any>(
  promiseCreator: () => Promise<T> | undefined,
  dependencies: any[] = [promiseCreator],
) => {
  const emitError = useErrorEmitter()
  const [val, setVal] = useState<T | undefined>(undefined)
  useEffect(() => {
    const promise = promiseCreator()
    if (!promise) return
    promise.then(v => setVal(v)).catch(emitError)
  }, [emitError, ...dependencies]) // eslint-disable-line caleb/react-hooks/exhaustive-deps
  return val
}
