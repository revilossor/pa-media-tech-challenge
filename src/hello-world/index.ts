import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

async function handler (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'hello world' })
  }
}

export const main = handler
