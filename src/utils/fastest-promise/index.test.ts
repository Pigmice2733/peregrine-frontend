import { fastestPromise } from '.'

type PromiseResolver<T> = (value: T | PromiseLike<T>) => void

interface ModifyablePromise<T> extends Promise<T> {
  resolve: PromiseResolver<T>
  reject: PromiseResolver<T>
}

const createModifyablePromise = <T = never>() => {
  let resolvePromise: PromiseResolver<T>
  let rejectPromise: PromiseResolver<T>
  const promise = new Promise<T>((resolve, reject) => {
    resolvePromise = resolve
    rejectPromise = reject
  })
  // @ts-expect-error
  promise.resolve = resolvePromise
  // @ts-expect-error
  promise.reject = rejectPromise
  return promise as ModifyablePromise<T>
}

test('resolves with first value when first promise resolves first', () => {
  const firstPromise = createModifyablePromise<string>()
  const secondPromise = createModifyablePromise<string>()
  firstPromise.resolve('first')
  return expect(fastestPromise(firstPromise, secondPromise)).resolves.toBe(
    'first',
  )
})

test('resolves with second value when second promise resolves first', () => {
  const firstPromise = createModifyablePromise<string>()
  const secondPromise = createModifyablePromise<string>()
  secondPromise.resolve('second')
  setTimeout(() => {
    firstPromise.resolve('first')
  }, 1)
  return expect(fastestPromise(firstPromise, secondPromise)).resolves.toBe(
    'second',
  )
})

test('resolves with first value when second promise rejects', () => {
  const firstPromise = createModifyablePromise<string>()
  const secondPromise = createModifyablePromise<string>()
  secondPromise.reject('second')
  setTimeout(() => {
    firstPromise.resolve('first')
  }, 1)
  return expect(fastestPromise(firstPromise, secondPromise)).resolves.toBe(
    'first',
  )
})

test('resolves with second value when first promise rejects', () => {
  const firstPromise = createModifyablePromise<string>()
  const secondPromise = createModifyablePromise<string>()
  firstPromise.reject('first')
  setTimeout(() => {
    secondPromise.resolve('second')
  }, 1)
  return expect(fastestPromise(firstPromise, secondPromise)).resolves.toBe(
    'second',
  )
})

test('rejects with first value when both promises reject', () => {
  const firstPromise = createModifyablePromise<string>()
  const secondPromise = createModifyablePromise<string>()
  firstPromise.reject('first')
  secondPromise.reject('second')
  return expect(fastestPromise(firstPromise, secondPromise)).rejects.toMatch(
    /first|second/,
  )
})
