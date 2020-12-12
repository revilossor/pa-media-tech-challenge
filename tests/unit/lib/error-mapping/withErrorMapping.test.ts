import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import withErrorMapping from '../../../../src/lib/error-mapping/withErrorMapping'

class CustomError extends Error {
  name = 'CustomError'
}

const errorMap = new Map([[CustomError.name, 123]])

let result: APIGatewayProxyResult

describe('Given I have a lambda handler withErrorMapping', () => {
  describe('And the handler does not throw', () => {
    const happyResponse = {
      statusCode: 200,
      body: 'Saul Goodman'
    }
    const handler = async (): Promise<APIGatewayProxyResult> => {
      return happyResponse
    }

    beforeEach(async () => {
      result = await withErrorMapping({
        handler,
        errorMap
      })({} as unknown as APIGatewayProxyEvent)
    })

    it('Then the return value of the handler is returned', () => {
      expect(result).toEqual(happyResponse)
    })
  })

  describe('And the handler throws an error', () => {
    const unmappedError = new Error('poop')
    const unmappedErrorHandler = async (): Promise<APIGatewayProxyResult> => {
      throw unmappedError
    }

    describe('And the error is mapped to a statusCode', () => {
      const mappedError = new CustomError('the moon')
      const handler = async (): Promise<APIGatewayProxyResult> => {
        throw mappedError
      }

      beforeEach(async () => {
        result = await withErrorMapping({
          handler,
          errorMap
        })({} as unknown as APIGatewayProxyEvent)
      })

      describe('Then an error response is returned', () => {
        it('With the mapped statusCode for the error', () => {
          expect(result.statusCode).toBe(errorMap.get(CustomError.name))
        })

        it('With the body as the message from the error', () => {
          expect(result.body).toBe(JSON.stringify({
            message: mappedError.message
          }))
        })
      })
    })

    describe('And the error is not mapped', () => {
      const thrownError = new Error('poop')
      const handler = async (): Promise<APIGatewayProxyResult> => {
        throw thrownError
      }

      beforeEach(async () => {
        result = await withErrorMapping({
          handler,
          errorMap
        })({} as unknown as APIGatewayProxyEvent)
      })

      describe('Then an error response is returned', () => {
        it('With the a 500 status code', () => {
          expect(result.statusCode).toBe(500)
        })

        it('With the body as the message from the error', () => {
          expect(result.body).toBe(JSON.stringify({
            message: thrownError.message
          }))
        })
      })
    })

    describe('And I pass a logger', () => {
      const logger = {
        error: jest.fn()
      }

      beforeEach(async () => {
        result = await withErrorMapping({
          handler: unmappedErrorHandler,
          errorMap,
          logger
        })({} as unknown as APIGatewayProxyEvent)
      })

      it('Then the error is logged to the error level', () => {
        expect(logger.error).toHaveBeenCalledWith({
          message: unmappedError.message,
          errorCode: 500
        })
      })
    })

    describe('And I supress messages', () => {
      beforeEach(async () => {
        result = await withErrorMapping({
          handler: unmappedErrorHandler,
          errorMap,
          suppressErrorMessages: true
        })({} as unknown as APIGatewayProxyEvent)
      })

      describe('Then an error response is returned', () => {
        it('With an empty body', () => {
          expect(result.body).toBe('')
        })
      })
    })
  })
})
