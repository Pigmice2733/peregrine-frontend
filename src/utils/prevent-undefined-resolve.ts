import { EMPTY_PROMISE } from './empty-promise'

/**
 * Prevents a promise from resolving if it resolves with undefined.
 * For use in a .then() callback.
 * @example
 * foo().then(preventUndefinedResolve)
 */
export const preventUndefinedResolve = <T>(
  data: T | undefined,
): T | Promise<T> => (data === undefined ? EMPTY_PROMISE : data)
