import { useState, useEffect } from 'preact/hooks'
import { useErrorEmitter } from '@/components/error-boundary'

export const usePromise = <T extends any>(promise: () => Promise<T>) => {
  const emitError = useErrorEmitter()
  const [val, setVal] = useState<T | undefined>(undefined)
  const [lastResolved, setLastResolved] = useState<
    undefined | (() => Promise<T>)
  >(undefined)
  useEffect(() => {
    // setVal(undefined)
    promise()
      .then(v => {
        // this is a function (gets passed the old state) because otherwise it gets passed to the promise cb
        setLastResolved(() => promise)
        setVal(v)
      })
      .catch(emitError)
  }, [emitError, promise])
  return lastResolved === promise ? val : undefined
}
