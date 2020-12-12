import { APIGatewayProxyResult } from 'aws-lambda'
import { main } from '../../../src/create-list'
import getEvent from '../helper/getEvent'
import parseEvent from '../../../src/lib/parseEvent'

jest.mock('../../../src/lib/parseEvent')

const parse = parseEvent as jest.Mock

const mockRepo = {
  create: jest.fn(),
  close: jest.fn()
}

jest.mock('../../../src/lib/repository/ListRepository', () => ({
  default: { fromId: () => mockRepo }
}))

const key = 'listKey'

describe('When I invoke the create-list handler', () => {
  const event = getEvent({
    listKey: key
  })

  let result: APIGatewayProxyResult

  describe('And the event is valid', () => {
    beforeEach(async () => {
      parse.mockReturnValue({ listKey: key })
      mockRepo.create.mockResolvedValue([{ key }])
      result = await main(event)
    })

    it('Then the event is parsed', () => {
      expect(parseEvent).toHaveBeenCalledWith(event)
    })

    it('And the list is created', () => {
      expect(mockRepo.create).toHaveBeenCalledWith({ key })
    })

    it('And the list repository is closed', () => {
      expect(mockRepo.close).toHaveBeenCalled()
    })

    describe('And the handler returns correctly', () => {
      it('With a statusCode of 200', () => {
        expect(result.statusCode).toBe(200)
      })

      it('And a list containing just the created list', () => {
        expect(result.body).toBe(JSON.stringify([{ key }]))
      })
    })
  })

  describe('And the event is not valid', () => {
    beforeEach(async () => {
      parse.mockReturnValue({})
      result = await main(event)
    })

    describe('Then the handler returns correctly', () => {
      it('With a statusCode of 500', () => {
        expect(result.statusCode).toBe(500)
      })

      it('And an informative message', () => {
        expect(result.body).toBe(JSON.stringify({
          message: 'unable to extract list key from path parameters'
        }))
      })
    })
  })

  describe('And there is an error creating the list', () => {
    const error = Error('some error')

    beforeEach(async () => {
      parse.mockReturnValue({ listKey: key })
      mockRepo.create.mockRejectedValue(error)
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
