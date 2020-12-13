import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import errorMap, { withErrorMapping } from '../lib/error-mapping'
import { BadRequestError } from '../lib/error-mapping/BadRequestError'
import parseEvent from '../lib/parseEvent'
import ListRepository from '../lib/repository/ListRepository'

async function handler (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const { listKey } = parseEvent(event)
  if (listKey === undefined) {
    throw new BadRequestError('unable to extract list key from path parameters')
  }
  const repo = ListRepository.fromId('all_lists')
  const list = await repo.create({ key: listKey })
  await repo.close()
  return {
    statusCode: 200,
    body: JSON.stringify(list)
  }
}

export const main = withErrorMapping({
  handler,
  errorMap
})
