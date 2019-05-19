import { useState, useEffect } from 'preact/hooks'
import { useErrorEmitter } from '@/components/error-boundary'

export const usePromise = <T extends any>(
  promise: () => Promise<T>,
  dependencies: any[] = [promise],
) => {
  const emitError = useErrorEmitter()
  const [val, setVal] = useState<T | undefined>(undefined)
  useEffect(() => {
    promise()
      .then(v => {
        setVal(v)
      })
      .catch(emitError)
  }, [emitError, ...dependencies]) // eslint-disable-line caleb/react-hooks/exhaustive-deps
  return val
}
