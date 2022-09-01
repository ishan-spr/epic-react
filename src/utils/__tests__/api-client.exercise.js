import {server, rest} from 'test/server'
import {client} from '../api-client'
import {queryCache} from 'react-query'
import * as auth from 'auth-provider'

jest.mock('react-query')
jest.mock('auth-provider')

const apiURL = process.env.REACT_APP_API_URL

beforeAll(() => {
  server.listen()
})
afterAll(() => {
  server.close()
})
afterEach(() => {
  server.resetHandlers()
})
// 🐨 flesh these out:

test('calls fetch at the endpoint with the arguments for GET requests', async () => {
  const endpoint = 'test-endpoint'
  const mockResult = {mockValue: 'VALUE'}
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.json(mockResult))
    }),
  )
  const result = await client(endpoint)
  expect(result).toEqual(mockResult)
})

test('adds auth token when a token is provided', async () => {
  const token = 'FAKE_TOKEN'
  let request
  const endpoint = 'test-endpoint'
  const mockResult = {mockValue: 'VALUE'}
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json(mockResult))
    }),
  )
  await client(endpoint, {token})
  expect(request.headers.get('Authorization')).toBe(`Bearer ${token}`)
})

test('allows for config overrides', async () => {
  const headers = {'x-test': 'JUST FOR FUN'}
  let request
  const endpoint = 'test-endpoint'
  const mockResult = {mockValue: 'VALUE'}
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json(mockResult))
    }),
  )
  await client(endpoint, {headers})
  expect(request.headers.get('x-test')).toBe('JUST FOR FUN')
})

test('when data is provided, it is stringified and the method defaults to POST', async () => {
  const data = {name: 'ISHAN'}
  let request
  const endpoint = 'test-endpoint'
  server.use(
    rest.post(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json(req.body))
    }),
  )
  let result = await client(endpoint, {data})
  expect(request.method).toBe('POST')
  expect(result).toEqual(data)
})

test('Promise Rejection on error', async () => {
  const endpoint = 'test-endpoint'
  const mockResult = {mockValue: 'VALUE'}
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.status(400), ctx.json(mockResult))
    }),
  )
  await expect(client(endpoint)).rejects.toEqual(mockResult)
})

test('User Logout', async () => {
  const endpoint = 'test-endpoint'
  const mockResult = {mockValue: 'VALUE'}
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.status(401), ctx.json(mockResult))
    }),
  )

  const error = await client(endpoint).catch(e => e)

  expect(error.message).toMatchInlineSnapshot(`"Please re-authenticate."`)

  expect(queryCache.clear).toHaveBeenCalledTimes(1)
  expect(auth.logout).toHaveBeenCalledTimes(1)
})
