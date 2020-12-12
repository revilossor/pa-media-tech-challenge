import { APIGatewayProxyEvent } from 'aws-lambda'

export interface EventParams {
  listKey?: string
  itemKey?: string
  value?: string
}

export default function getEvent (params?: EventParams): APIGatewayProxyEvent {
  if (params === undefined) {
    return {} as unknown as APIGatewayProxyEvent
  }
  return {
    pathParameters: {
      listKey: params?.listKey ?? undefined,
      itemKey: params?.itemKey ?? undefined
    },
    body: params.value === undefined ? '' : JSON.stringify({
      value: params.value
    })
  } as unknown as APIGatewayProxyEvent
}
