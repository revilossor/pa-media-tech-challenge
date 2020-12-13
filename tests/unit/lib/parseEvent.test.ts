import { APIGatewayProxyEvent } from 'aws-lambda'
import parseEvent from '../../../src/lib/parseEvent'

const listKey = 'listKey'
const itemKey = 'itemKey'
const value = 'value'

describe('When I parse an event', () => {
  describe.each([
    [
      'contains all parameters',
      { pathParameters: { listKey, itemKey }, body: '{"value":"value"}' },
      { listKey, itemKey, value }
    ],
    [
      'contains item key and value',
      { pathParameters: { itemKey }, body: '{"value":"value"}' },
      { itemKey, value }
    ],
    [
      'contains list key and value',
      { pathParameters: { listKey }, body: '{"value":"value"}' },
      { listKey, value }
    ],
    [
      'has an empty body and no keys',
      { body: '' },
      { }
    ],
    [
      'has no body',
      { pathParameters: { listKey, itemKey } },
      { listKey, itemKey }
    ]
  ])('And the event %s', (_, event, expected) => {
    it(`The the returned structure has "${Object.keys(expected).join(' ')}" keys`, () => {
      expect(parseEvent(event as unknown as APIGatewayProxyEvent)).toEqual(expected)
    })
  })
})
