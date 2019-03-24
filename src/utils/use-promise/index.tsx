import { useState, useEffect } from 'preact/hooks'

export const usePromise = <T extends any>(promise: () => Promise<T>) => {
  const [val, setVal] = useState<T | undefined>(undefined)
  useEffect(() => {
    promise().then(setVal)
  }, [promise])
  return val
}
