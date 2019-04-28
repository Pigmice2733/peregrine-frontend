import { useState, useEffect } from 'preact/hooks'

export const usePromise = <T extends any>(promise: () => Promise<T>) => {
  const [val, setVal] = useState<T | undefined>(undefined)
  const [lastResolved, setLastResolved] = useState<
    undefined | (() => Promise<T>)
  >(undefined)
  useEffect(() => {
    // setVal(undefined)
    promise().then(v => {
      // this is a function (gets passed the old state) because otherwise it gets passed to the promise cb
      setLastResolved(() => promise)
      setVal(v)
    })
  }, [promise])
  return lastResolved === promise ? val : undefined
}
