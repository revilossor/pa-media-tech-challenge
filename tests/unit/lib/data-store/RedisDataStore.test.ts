import RedisDataStore from '../../../../src/lib/data-store/RedisDataStore'
import { createNodeRedisClient } from 'handy-redis'

const createClient = createNodeRedisClient as jest.Mock

const mockRedisClient = {
  set: jest.fn(),
  del: jest.fn()
}

jest.mock('handy-redis')

interface TestThing {
  key: string
  favouriteColour: string
}

const thing: TestThing = {
  key: 'a test thing',
  favouriteColour: 'rainbow'
}

describe('When I instantiate a RedisDataStore', () => {
  let instance: RedisDataStore<TestThing>

  beforeEach(() => {
    createClient.mockImplementation(() => mockRedisClient)
    instance = new RedisDataStore<TestThing>()
  })

  describe('Then a redis client is initialised', () => {
    it('With the correct url', () => {
      expect(createNodeRedisClient).toHaveBeenCalledWith({
        url: 'redis://redis/'
      })
    })
  })

  describe('When I create an item', () => {
    let result: TestThing[]

    beforeEach(async () => {
      result = await instance.create(thing)
    })

    it('Then the client is used to set the item in redis', () => {
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        thing.key,
        JSON.stringify(thing)
      )
    })

    it('And a list containing the created item only is returned', () => {
      expect(result).toEqual([thing])
    })
  })

  describe('When I update an item', () => {
    let result: TestThing[]

    beforeEach(async () => {
      result = await instance.update('key', thing)
    })

    it('Then the client is used to set the item in redis', () => {
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        thing.key,
        JSON.stringify(thing)
      )
    })

    it('And a list containing the updated item only is returned', () => {
      expect(result).toEqual([thing])
    })
  })

  describe('When I remove an item', () => {
    beforeEach(async () => {
      await instance.remove(thing.key)
    })

    it('Then the client is used to del the item key in redis', () => {
      expect(mockRedisClient.del).toHaveBeenCalledWith(
        thing.key
      )
    })
  })

  describe('When I find an item', () => {
    beforeEach(async () => {
      await instance.find('key')
    })

    it('has tests', () => {
      expect(true).toBe(true)
    })
  })

  describe('When I list items', () => {
    beforeEach(async () => {
      await instance.list()
    })

    it('has tests', () => {
      expect(true).toBe(true)
    })
  })
})
