import { APIGatewayProxyEvent } from 'aws-lambda'

export interface EventParams {
  listKey?: string
  itemKey?: string
  value?: string
}

export default function parseEvent (event: APIGatewayProxyEvent): EventParams {
  let value
  const body = event.body ?? ''
  if (body.length > 0) {
    value = JSON.parse(body).value
  }
  return {
    listKey: event.pathParameters?.listKey ?? undefined,
    itemKey: event.pathParameters?.itemKey ?? undefined,
    value
  }
}
