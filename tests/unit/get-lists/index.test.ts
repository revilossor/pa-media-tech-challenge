import { APIGatewayProxyResult } from 'aws-lambda'
import { main } from '../../../src/get-lists'
import { List } from '../../../src/types'
import getEvent from '../helper/getEvent'

const mockRepo = {
  list: jest.fn(),
  close: jest.fn()
}

jest.mock('../../../src/lib/repository/ListRepository', () => ({
  default: { fromId: () => mockRepo }
}))

describe('When I invoke the get-lists handler', () => {
  let result: APIGatewayProxyResult
  const event = getEvent()

  describe('And some lists exist', () => {
    const storedList = [
      { key: '1' },
      { key: '2' },
      { key: '3' }
    ]

    beforeEach(async () => {
      mockRepo.list.mockResolvedValue(storedList)
      result = await main(event)
    })

    it('Then the lists are retrieved from the list repository', () => {
      expect(mockRepo.list).toHaveBeenCalled()
    })

    it('And the list repository is closed', () => {
      expect(mockRepo.close).toHaveBeenCalled()
    })

    describe('And the handler returns correctly', () => {
      it('With a statusCode of 200', () => {
        expect(result.statusCode).toBe(200)
      })

      it('And all the lists that exist', () => {
        expect(result.body).toBe(JSON.stringify(storedList))
      })
    })
  })

  describe('And there are no lists', () => {
    const storedList: List[] = []

    beforeEach(async () => {
      mockRepo.list.mockResolvedValue(storedList)
      result = await main(event)
    })

    describe('Then the handler returns correctly', () => {
      it('With a statusCode of 200', () => {
        expect(result.statusCode).toBe(200)
      })

      it('And an empty list', () => {
        expect(result.body).toBe(JSON.stringify(storedList))
      })
    })
  })

  describe('And there is an error', () => {
    const error = Error('some error')

    beforeEach(async () => {
      mockRepo.list.mockRejectedValue(error)
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
