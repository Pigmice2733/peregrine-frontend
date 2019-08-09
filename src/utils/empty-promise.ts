/**
 * Promise that never resolves
 */
export const EMPTY_PROMISE = new Promise<never>(() => {})
