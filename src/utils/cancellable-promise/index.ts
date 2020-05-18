/* eslint-disable caleb/@shopify/prefer-class-properties */

type OnCanceled = (cb: () => void) => void
type Executor<T> = (
  resolve: (value?: T | PromiseLike<T>) => void,
  reject: (reason?: any) => void,
  onCanceled: OnCanceled,
) => void

class CancellablePromise<T> extends Promise<T> {
  private isCanceled: boolean
  private cancelListeners: Set<() => void>

  static wrapAsync<T>(
    asyncFunc: (onCanceled: OnCanceled) => Promise<T>,
  ): CancellablePromise<T> {
    return new CancellablePromise((resolve, reject, onCancel) =>
      asyncFunc(onCancel).then(resolve, reject),
    )
  }

  static all(promises: Iterable<any>): CancellablePromise<any> {
    return new CancellablePromise((resolve, reject, onCancel) => {
      Promise.all(promises).then(resolve, reject)
      onCancel(() => {
        for (const p of promises) {
          if (p instanceof CancellablePromise) p.cancel()
        }
      })
    })
  }

  constructor(executor: Executor<T>) {
    const cancelListeners = new Set<() => void>()
    super((resolve, reject) => {
      const onCanceled = (cb: () => void) => cancelListeners.add(cb)
      executor(resolve, reject, onCanceled)
    })
    this.isCanceled = false
    this.cancelListeners = cancelListeners
  }

  cancel() {
    if (this.isCanceled) return
    this.isCanceled = true
    this.cancelListeners.forEach((cb) => cb())
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): CancellablePromise<TResult1 | TResult2> {
    const p = new CancellablePromise<TResult1 | TResult2>(
      (resolve, reject, onCancel) => {
        super.then(
          (val) => {
            if (!this.isCanceled)
              resolve(
                onfulfilled ? onfulfilled(val) : ((val as any) as TResult1),
              )
          },
          (error) => {
            if (this.isCanceled) return
            if (onrejected) resolve(onrejected(error))
            // If there is no catcher, the sub-promise should reject
            else reject(error)
          },
        )
        // When the chained promise cancels, this one should too
        // fetch().then(...).then(...).cancel() should cancel the first promise
        onCancel(() => this.cancel())
      },
    )
    return p
  }
  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
  ): CancellablePromise<T | TResult> {
    return this.then(null, onrejected)
  }
}

CancellablePromise.resolve()

type CPromise<T> = CancellablePromise<T>
const CPromise = CancellablePromise as CancellablePromiseConstructor

export { CPromise as CancellablePromise }

interface CancellablePromise<T> {
  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
  ): CancellablePromise<T | TResult>
}

interface CancellablePromiseConstructor extends PromiseConstructor {
  readonly prototype: CancellablePromise<any>
  new <T>(executor: Executor<T>): CancellablePromise<T>

  wrapAsync<T>(
    asyncFunc: (onCanceled: OnCanceled) => Promise<T>,
  ): CancellablePromise<T>

  resolve: {
    <T>(value: T | PromiseLike<T>): CancellablePromise<T>
    (): CancellablePromise<void>
  }

  all<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
    values: readonly [
      T1 | PromiseLike<T1>,
      T2 | PromiseLike<T2>,
      T3 | PromiseLike<T3>,
      T4 | PromiseLike<T4>,
      T5 | PromiseLike<T5>,
      T6 | PromiseLike<T6>,
      T7 | PromiseLike<T7>,
      T8 | PromiseLike<T8>,
      T9 | PromiseLike<T9>,
      T10 | PromiseLike<T10>,
    ],
  ): CancellablePromise<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]>
  all<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
    values: readonly [
      T1 | PromiseLike<T1>,
      T2 | PromiseLike<T2>,
      T3 | PromiseLike<T3>,
      T4 | PromiseLike<T4>,
      T5 | PromiseLike<T5>,
      T6 | PromiseLike<T6>,
      T7 | PromiseLike<T7>,
      T8 | PromiseLike<T8>,
      T9 | PromiseLike<T9>,
    ],
  ): CancellablePromise<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>
  all<T1, T2, T3, T4, T5, T6, T7, T8>(
    values: readonly [
      T1 | PromiseLike<T1>,
      T2 | PromiseLike<T2>,
      T3 | PromiseLike<T3>,
      T4 | PromiseLike<T4>,
      T5 | PromiseLike<T5>,
      T6 | PromiseLike<T6>,
      T7 | PromiseLike<T7>,
      T8 | PromiseLike<T8>,
    ],
  ): CancellablePromise<[T1, T2, T3, T4, T5, T6, T7, T8]>
  all<T1, T2, T3, T4, T5, T6, T7>(
    values: readonly [
      T1 | PromiseLike<T1>,
      T2 | PromiseLike<T2>,
      T3 | PromiseLike<T3>,
      T4 | PromiseLike<T4>,
      T5 | PromiseLike<T5>,
      T6 | PromiseLike<T6>,
      T7 | PromiseLike<T7>,
    ],
  ): CancellablePromise<[T1, T2, T3, T4, T5, T6, T7]>
  all<T1, T2, T3, T4, T5, T6>(
    values: readonly [
      T1 | PromiseLike<T1>,
      T2 | PromiseLike<T2>,
      T3 | PromiseLike<T3>,
      T4 | PromiseLike<T4>,
      T5 | PromiseLike<T5>,
      T6 | PromiseLike<T6>,
    ],
  ): CancellablePromise<[T1, T2, T3, T4, T5, T6]>
  all<T1, T2, T3, T4, T5>(
    values: readonly [
      T1 | PromiseLike<T1>,
      T2 | PromiseLike<T2>,
      T3 | PromiseLike<T3>,
      T4 | PromiseLike<T4>,
      T5 | PromiseLike<T5>,
    ],
  ): CancellablePromise<[T1, T2, T3, T4, T5]>
  all<T1, T2, T3, T4>(
    values: readonly [
      T1 | PromiseLike<T1>,
      T2 | PromiseLike<T2>,
      T3 | PromiseLike<T3>,
      T4 | PromiseLike<T4>,
    ],
  ): CancellablePromise<[T1, T2, T3, T4]>
  all<T1, T2, T3>(
    values: readonly [
      T1 | PromiseLike<T1>,
      T2 | PromiseLike<T2>,
      T3 | PromiseLike<T3>,
    ],
  ): CancellablePromise<[T1, T2, T3]>
  all<T1, T2>(
    values: readonly [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>],
  ): CancellablePromise<[T1, T2]>
  all<T>(values: readonly (T | PromiseLike<T>)[]): CancellablePromise<T[]>
  all<TAll>(values: Iterable<TAll | PromiseLike<TAll>>): Promise<TAll[]>
}
