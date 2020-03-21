import { CancellablePromise } from '.'

const nextTick = () => Promise.resolve()

describe('behaves like a normal promise', () => {
  it('only resolves once', async () => {
    let resolve: (value?: string | PromiseLike<string>) => void = () => {}
    let reject: (reason?: any) => void = () => {}
    const promise: Promise<string> = new CancellablePromise<string>(
      (res, rej) => {
        resolve = res
        reject = rej
      },
    )

    const beforeCallback = jest.fn()
    promise.then(beforeCallback)
    expect(beforeCallback).not.toHaveBeenCalled()

    resolve('hi')

    await nextTick()

    expect(beforeCallback).toHaveBeenCalledTimes(1)
    expect(beforeCallback).toHaveBeenLastCalledWith('hi')

    const afterCallback = jest.fn()

    promise.then(afterCallback)

    await nextTick()

    expect(afterCallback).toHaveBeenCalledTimes(1)
    expect(afterCallback).toHaveBeenCalledWith('hi')

    reject()

    // Catch should not have called, since it already resolved
    const catchCallback = jest.fn()
    promise.catch(catchCallback)
    await nextTick()
    expect(catchCallback).not.toHaveBeenCalled()

    resolve('hi again')
    // Should not call then again, since it already resolved
    expect(afterCallback).toHaveBeenCalledTimes(1)
    expect(afterCallback).toHaveBeenCalledWith('hi')
  })

  it('resolves correct value from catch', async () => {
    let reject: (reason?: any) => void = () => {}
    const promise: Promise<string> = new CancellablePromise<string>(
      (_res, rej) => {
        reject = rej
      },
    )

    const onResolve = jest.fn()
    const onReject = jest.fn(
      () => new Promise<number>((resolve) => resolve(30)),
    )
    const onResolve2 = jest.fn()

    const p1 = promise
    const p2 = p1.then(onResolve)
    const p3 = p2.catch(onReject)
    const p4 = p3.then(onResolve2)
    await nextTick()
    expect(onResolve).not.toHaveBeenCalled()
    expect(onReject).not.toHaveBeenCalled()
    expect(onResolve2).not.toHaveBeenCalled()

    reject('bad')

    expect(p4).toBeInstanceOf(CancellablePromise)

    await nextTick()
    await nextTick()
    expect(onResolve).not.toHaveBeenCalled()
    expect(onReject).toHaveBeenCalledTimes(1)
    expect(onReject).toHaveBeenCalledWith('bad')
    await nextTick()
    await nextTick()
    await nextTick()
    expect(onResolve2).toHaveBeenCalledTimes(1)
    expect(onResolve2).toHaveBeenCalledWith(30)
  })
})

describe('cancellable functionality', () => {
  it('cancelling prevents .then and .catch callbacks from being called', async () => {
    let resolve: (value?: string | PromiseLike<string>) => void = () => {}
    let reject: (reason?: any) => void = () => {}
    const cancelCallback = jest.fn()
    const promise = new CancellablePromise<string>((res, rej, onCanceled) => {
      resolve = res
      reject = rej
      onCanceled(cancelCallback)
    })

    const thenCallback = jest.fn()
    promise.then(thenCallback)

    expect(cancelCallback).not.toHaveBeenCalled()

    promise
      .then(() => {})
      .catch(() => {})
      .cancel()

    expect(cancelCallback).toHaveBeenCalledTimes(1)
    expect(cancelCallback).toHaveBeenCalledWith()

    resolve('hi')
    reject()

    await nextTick()

    expect(thenCallback).not.toHaveBeenCalled()
  })

  it('cancels subpromises with Promise.all', async () => {
    const onP1Cancel = jest.fn()
    const onP2Cancel = jest.fn()
    const p1 = new CancellablePromise<string>((_res, _rej, onCanceled) => {
      onCanceled(onP1Cancel)
    })
    const p2 = new CancellablePromise<string>((_res, _rej, onCanceled) => {
      onCanceled(onP2Cancel)
    })
    const p3 = new Promise<never>(() => {})
    const all = CancellablePromise.all([p1, p2, p3])
    expect(all).toBeInstanceOf(CancellablePromise)
    await nextTick()
    expect(onP1Cancel).not.toHaveBeenCalled()
    expect(onP2Cancel).not.toHaveBeenCalled()
    all.cancel()
    await nextTick()
    await nextTick()
    await nextTick()
    expect(onP1Cancel).toHaveBeenCalledTimes(1)
    expect(onP2Cancel).toHaveBeenCalledTimes(1)
  })
})
