import { APIGatewayProxyResult } from 'aws-lambda'
import { main } from '../../../src/update-item'
import getEvent from '../helper/getEvent'
import parseEvent from '../../../src/lib/parseEvent'

jest.mock('../../../src/lib/parseEvent')

const parse = parseEvent as jest.Mock

const mockListRepo = {
  find: jest.fn(),
  close: jest.fn()
}

const mockItemRepo = {
  update: jest.fn(),
  close: jest.fn()
}

jest.mock('../../../src/lib/repository/ListRepository', () => ({
  default: { fromId: () => mockListRepo }
}))
jest.mock('../../../src/lib/repository/ItemRepository', () => ({
  default: { fromId: () => mockItemRepo }
}))

const listKey = 'listKey'
const itemKey = 'itemKey'
const value = 'some item value'

describe('When I invoke the update-item handler', () => {
  const event = getEvent({
    listKey,
    itemKey,
    value
  })

  let result: APIGatewayProxyResult

  describe('And the event is valid', () => {
    beforeEach(async () => {
      parse.mockReturnValue({ listKey, itemKey, value })
      mockListRepo.find.mockResolvedValue([{ listKey }])
      mockItemRepo.update.mockResolvedValue([{ itemKey }])
      result = await main(event)
    })

    it('Then the event is parsed', () => {
      expect(parseEvent).toHaveBeenCalledWith(event)
    })

    it('And the list repository is checked for the list key', () => {
      expect(mockListRepo.find).toHaveBeenCalledWith(listKey)
    })

    it('And the item is updated in the item repository', () => {
      expect(mockItemRepo.update).toHaveBeenCalledWith({
        key: itemKey,
        listKey,
        value
      })
    })

    it('And the list repository is closed', () => {
      expect(mockListRepo.close).toHaveBeenCalled()
    })

    it('And the item repository is closed', () => {
      expect(mockItemRepo.close).toHaveBeenCalled()
    })

    describe('And the handler returns correctly', () => {
      it('With a statusCode of 200', () => {
        expect(result.statusCode).toBe(200)
      })

      it('And a list containing just the created item', () => {
        expect(result.body).toBe(JSON.stringify([{
          itemKey
        }]))
      })
    })
  })

  describe('And the event is not valid', () => {
    describe('When there is no list key', () => {
      beforeEach(async () => {
        parse.mockReturnValue({ itemKey, value })
        result = await main(event)
      })

      describe('Then the handler returns correctly', () => {
        it('With a statusCode of 400', () => {
          expect(result.statusCode).toBe(400)
        })

        it('And an informative message', () => {
          expect(result.body).toBe(JSON.stringify({
            message: 'unable to extract list key from path parameters'
          }))
        })
      })
    })
    describe('When there is no item key', () => {
      beforeEach(async () => {
        parse.mockReturnValue({ listKey, value })
        result = await main(event)
      })

      describe('Then the handler returns correctly', () => {
        it('With a statusCode of 400', () => {
          expect(result.statusCode).toBe(400)
        })

        it('And an informative message', () => {
          expect(result.body).toBe(JSON.stringify({
            message: 'unable to extract item key from path parameters'
          }))
        })
      })
    })
    describe('When there is no value', () => {
      beforeEach(async () => {
        parse.mockReturnValue({ listKey, itemKey })
        result = await main(event)
      })

      describe('Then the handler returns correctly', () => {
        it('With a statusCode of 400', () => {
          expect(result.statusCode).toBe(400)
        })

        it('And an informative message', () => {
          expect(result.body).toBe(JSON.stringify({
            message: 'unable to extract item value from request body'
          }))
        })
      })
    })
  })

  describe('And the list key does not exist', () => {
    beforeEach(async () => {
      parse.mockReturnValue({ listKey, itemKey, value })
      mockListRepo.find.mockResolvedValue([])
      result = await main(event)
    })

    describe('Then the handler returns correctly', () => {
      it('With a statusCode of 404', () => {
        expect(result.statusCode).toBe(404)
      })

      it('And an informative message', () => {
        expect(result.body).toBe(JSON.stringify({
          message: `unable to find list "${listKey}"`
        }))
      })
    })
  })

  describe('And there is a generic error', () => {
    const error = Error('some error')

    beforeEach(async () => {
      parse.mockReturnValue({ listKey, itemKey, value })
      mockListRepo.find.mockRejectedValue(error)
      result = await main(event)
    })

    describe('Then the handler returns correctly', () => {
      it('With a statusCode of 500', () => {
        expect(result.statusCode).toBe(500)
      })

      it('And an informative message', () => {
        expect(result.body).toBe(JSON.stringify({
          message: error.message
        }))
      })
    })
  })
})
