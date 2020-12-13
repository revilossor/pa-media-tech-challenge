import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import errorMap, { withErrorMapping } from '../lib/error-mapping'
import parseEvent from '../lib/parseEvent'
import ListRepository from '../lib/repository/ListRepository'

async function handler (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const repo = ListRepository.fromId('all_lists')
  const { listKey } = parseEvent(event)
  if (listKey === undefined) {
    throw Error('unable to extract list key from path parameters')
  }
  const list = { key: listKey }
  await repo.remove(list)
  await repo.close()
  return {
    statusCode: 200,
    body: JSON.stringify([list])
  }
}

export const main = withErrorMapping({
  handler,
  errorMap
})
