import { CancellablePromise } from 'src/utils/cancellable-promise'

/**
 * Like Promise.race, but it only rejects if both promises reject
 */
export const fastestPromise = <T>(
  a: Promise<T>,
  b: Promise<T>,
): CancellablePromise<T> =>
  new CancellablePromise((resolve, reject) => {
    let resolved: false | T = false
    let rejected = false

    const resolveIfNotResolved = (value: T) => {
      if (!resolved) resolve((resolved = value))
    }

    const rejectIfOtherRejected = (error: any) => {
      if (rejected) reject(error)
      else rejected = true
    }

    a.then(resolveIfNotResolved).catch(rejectIfOtherRejected)
    b.then(resolveIfNotResolved).catch(rejectIfOtherRejected)
  })

export const createPromiseRace = <DataType, ArgsType extends any[]>(
  a: (...args: ArgsType) => Promise<DataType>,
  b: (...args: ArgsType) => Promise<DataType>,
) => (...args: ArgsType) => fastestPromise(a(...args), b(...args))
