/**
 * Promise that never resolves
 */
const EMPTY_PROMISE = new Promise<never>(() => {})

/**
 * Prevents a promise from resolving if it resolves with an empty array
 * For use in a .then() callback
 * @example
 * foo().then(preventEmptyArrResolve)
 */
export const preventEmptyArrResolve = <T extends any[]>(
  data: T,
): T | Promise<T> => (data.length === 0 ? EMPTY_PROMISE : data)
