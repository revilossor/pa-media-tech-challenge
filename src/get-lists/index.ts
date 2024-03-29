import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import errorMap, { withErrorMapping } from '../lib/error-mapping'
import ListRepository from '../lib/repository/ListRepository'

async function handler (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const repo = ListRepository.fromId('all_lists') // TODO config for this....
  const lists = await repo.list()
  await repo.close()
  return {
    statusCode: 200,
    body: JSON.stringify(lists)
  }
}

export const main = withErrorMapping({
  handler,
  errorMap
})
