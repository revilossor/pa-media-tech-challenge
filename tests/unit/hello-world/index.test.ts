import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { main } from '../../../src/hello-world'

describe('When I invoke the hello-world handler', () => {
  let result: APIGatewayProxyResult

  beforeEach(async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: {},
      body: ''
    } as unknown as APIGatewayProxyEvent

    result = await main(event)
  })

  describe('Then the handler returns correctly', () => {
    it('With a statusCode of 200', () => {
      expect(result.statusCode).toBe(200)
    })
    it('And a hello world message', () => {
      expect(result.body).toBe(JSON.stringify({ message: 'hello world' }))
    })
  })
})
