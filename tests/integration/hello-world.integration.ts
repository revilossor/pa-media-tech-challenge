import fetch, { Response } from 'node-fetch'

const url = 'http://localhost:3000/dev/v1/hello'

describe('When I make a request to the hello world endpoint', () => {
  let response: Response
  let body: object

  beforeEach(async () => {
    response = await fetch(url)
    body = await response.json()
  })

  it('Then the status code is 200', () => {
    expect(response.status).toBe(200)
  })

  it('And the body contains a "hello world" message', () => {
    expect(body).toEqual({ message: 'hello world' })
  })
})
