import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import errorMap, { withErrorMapping } from '../lib/error-mapping'
import parseEvent from '../lib/parseEvent'
import ListRepository from '../lib/repository/ListRepository'
import ItemRepository from '../lib/repository/ItemRepository'
import { NotFoundError } from '../lib/error-mapping/NotFoundError'
import { BadRequestError } from '../lib/error-mapping/BadRequestError'

async function handler (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const { listKey } = parseEvent(event)
  if (listKey === undefined) {
    throw new BadRequestError('unable to extract list key from path parameters')
  }

  const listRepo = ListRepository.fromId('all_lists')
  const [list] = await listRepo.find(listKey)
  if (list === undefined) {
    throw new NotFoundError(`unable to find list "${listKey}"`)
  }

  const itemRepo = ItemRepository.fromId(listKey)
  const items = await itemRepo.list()

  await listRepo.close()
  await itemRepo.close()

  return {
    statusCode: 200,
    body: JSON.stringify(items)
  }
}

export const main = withErrorMapping({
  handler,
  errorMap
})
