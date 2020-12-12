import { APIGatewayProxyEvent } from 'aws-lambda'
import parseEvent from '../../../src/lib/parseEvent'

const listKey = 'listKey'
const itemKey = 'itemKey'
const value = 'value'

describe.each([
  [
    { pathParameters: { listKey, itemKey }, body: '{"value":"value"}' },
    { listKey, itemKey, value }
  ],
  [
    { pathParameters: { itemKey }, body: '{"value":"value"}' },
    { itemKey, value }
  ],
  [
    { pathParameters: { listKey }, body: '{"value":"value"}' },
    { listKey, value }
  ],
  [
    { pathParameters: { listKey, itemKey }, body: '' },
    { listKey, itemKey }
  ],
  [
    { pathParameters: { listKey, itemKey } },
    { listKey, itemKey }
  ],
  [
    { body: '' },
    {}
  ]
])('When I parse an event', (event, expected) => {
  describe(`And the event is "${JSON.stringify(event)}"`, () => {
    it('Then the returned structure has the correct keys', () => {
      expect(parseEvent(event as unknown as APIGatewayProxyEvent)).toEqual(expected)
    })
  })
})
