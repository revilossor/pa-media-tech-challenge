import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

type APIGatewayHandlerFunction = (input: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>

interface ErrorMappingParams {
  handler: (input: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>
  errorMap: Map<string, number>
  logger?: { error: (...args: any[]) => any }
  suppressErrorMessages?: boolean
}

export default function withErrorMapping (params: ErrorMappingParams): APIGatewayHandlerFunction {
  return async (input: APIGatewayProxyEvent) => {
    try {
      return await params.handler(input)
    } catch (error) {
      const statusCode = params.errorMap.get(error.name) ?? 500
      if (params.logger !== undefined) {
        params.logger.error({
          errorCode: statusCode,
          message: error.message
        })
      }
      return {
        statusCode,
        body: params.suppressErrorMessages === true ? '' : error.message
      }
    }
  }
}
