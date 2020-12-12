import RedisDataStore from '../../../../src/lib/data-store/RedisDataStore'
import { createNodeRedisClient } from 'handy-redis'

const createClient = createNodeRedisClient as jest.Mock

const thing: TestThing = {
  key: 'a test thing',
  favouriteColour: 'rainbow'
}

const mockRedisClient = {
  set: jest.fn(),
  del: jest.fn(),
  get: jest.fn()
}

jest.mock('handy-redis')

interface TestThing {
  key: string
  favouriteColour: string
}

// TODO handle error cases...
describe('When I instantiate a RedisDataStore with an id', () => {
  let instance: RedisDataStore<TestThing>

  const id = 'test_id'

  beforeEach(() => {
    createClient.mockImplementation(() => mockRedisClient)
    instance = new RedisDataStore<TestThing>(id)
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

    it('Then the client is used to set the item in redis, with the store id in the key', () => {
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        `${id}::${thing.key}`,
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
      result = await instance.update(thing.key, thing)
    })

    it('Then the client is used to set the item in redis, with the store id in the key', () => {
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        `${id}::${thing.key}`,
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

    it('Then the client is used to del the store specific item key in redis', () => {
      expect(mockRedisClient.del).toHaveBeenCalledWith(
        `${id}::${thing.key}`
      )
    })
  })

  describe('When I find an item that exists', () => {
    let result: TestThing[]

    describe('And the item exists', () => {
      beforeEach(async () => {
        mockRedisClient.get.mockReturnValue(
          JSON.stringify(thing)
        )
        result = await instance.find(thing.key)
      })

      it('Then the client is used to get the store specific item key from redis', () => {
        expect(mockRedisClient.get).toHaveBeenCalledWith(`${id}::${thing.key}`)
      })

      it('And the parsed thing returned from redis is returned', () => {
        expect(result).toEqual([thing])
      })
    })

    describe('And the item does not exist', () => {
      beforeEach(async () => {
        result = await instance.find(thing.key)
      })

      it('Then the client is used to get the store specific item key from redis', () => {
        expect(mockRedisClient.get).toHaveBeenCalledWith(`${id}::${thing.key}`)
      })

      it('And an empty array is returned', () => {
        expect(result).toEqual([])
      })
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
