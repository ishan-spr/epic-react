import {renderHook, act} from '@testing-library/react'
import {useAsync} from '../hooks'

beforeEach(() => {
  jest.spyOn(console, 'error')
})

afterEach(() => {
  console.error.mockRestore()
})

function deferred() {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return {promise, resolve, reject}
}

test('calling run with a promise which resolves', async () => {
  let {promise, resolve} = deferred()
  const {result} = renderHook(() => useAsync())
  expect(result.current).toEqual({
    status: 'idle',
    data: null,
    error: null,
    isIdle: true,
    isLoading: false,
    isError: false,
    isSuccess: false,
    run: expect.any(Function),
    reset: expect.any(Function),
    setData: expect.any(Function),
    setError: expect.any(Function),
  })
  let p
  act(() => {
    p = result.current.run(promise)
  })
  expect(result.current.isLoading).toEqual(true)
  const resolvedValue = Symbol('resolved value')
  await act(async () => {
    resolve(resolvedValue)
    await p
  })
  expect(result.current.isSuccess).toEqual(true)
  act(() => result.current.reset())
  expect(result.current.isIdle).toEqual(true)
})

test('calling run with a promise which rejects', async () => {
  let {promise, reject} = deferred()
  const {result} = renderHook(() => useAsync())
  expect(result.current).toEqual({
    status: 'idle',
    data: null,
    error: null,
    isIdle: true,
    isLoading: false,
    isError: false,
    isSuccess: false,
    run: expect.any(Function),
    reset: expect.any(Function),
    setData: expect.any(Function),
    setError: expect.any(Function),
  })
  let p
  act(() => {
    p = result.current.run(promise)
  })
  expect(result.current.isLoading).toEqual(true)
  const resolvedValue = Symbol('resolved value')
  await act(async () => {
    reject(resolvedValue)
    await p.catch(() => {
      /* ignore erorr */
    })
  })
  expect(result.current.isError).toEqual(true)
  act(() => result.current.reset())
  expect(result.current.isIdle).toEqual(true)
})

test('can specify an initial state', () => {
  const {result} = renderHook(() => useAsync({data: 'hi'}))
  expect(result.current).toEqual({
    status: 'idle',
    data: 'hi',
    error: null,
    isIdle: true,
    isLoading: false,
    isError: false,
    isSuccess: false,
    run: expect.any(Function),
    reset: expect.any(Function),
    setData: expect.any(Function),
    setError: expect.any(Function),
  })
})

test('can set the data', () => {
  const {result} = renderHook(() => useAsync())
  expect(result.current).toEqual({
    status: 'idle',
    data: null,
    error: null,
    isIdle: true,
    isLoading: false,
    isError: false,
    isSuccess: false,
    run: expect.any(Function),
    reset: expect.any(Function),
    setData: expect.any(Function),
    setError: expect.any(Function),
  })
  act(() => result.current.setData('Hello'))
  expect(result.current.data).toBe('Hello')
})

test('can set the error', () => {
  const {result} = renderHook(() => useAsync())
  expect(result.current).toEqual({
    status: 'idle',
    data: null,
    error: null,
    isIdle: true,
    isLoading: false,
    isError: false,
    isSuccess: false,
    run: expect.any(Function),
    reset: expect.any(Function),
    setData: expect.any(Function),
    setError: expect.any(Function),
  })
  act(() => result.current.setError('Hello'))
  expect(result.current.error).toBe('Hello')
})

test('No state updates happen if the component is unmounted while pending', async () => {
  const {promise, resolve} = deferred()
  const {result, unmount} = renderHook(() => useAsync())
  let p
  act(() => {
    p = result.current.run(promise)
  })
  unmount()
  await act(async () => {
    resolve()
    await p
  })
  expect(console.error).not.toHaveBeenCalled()
})

test('calling "run" without a promise results in an early error', () => {
  const {result} = renderHook(() => useAsync())
  expect(() => result.current.run()).toThrowErrorMatchingInlineSnapshot(
    `"The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?"`,
  )
})
