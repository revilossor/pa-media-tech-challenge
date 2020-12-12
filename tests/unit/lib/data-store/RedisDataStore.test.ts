import RedisDataStore from '../../../../src/lib/data-store/RedisDataStore'
import { createNodeRedisClient } from 'handy-redis'

jest.mock('handy-redis')
/* eslint-disable @typescript-eslint/no-unused-vars */
describe('When I instantiate a RedisDataStore', () => {
  let instance: RedisDataStore<string>

  beforeEach(() => {
    instance = new RedisDataStore()
  })

  describe('Then a redis client is initialised', () => {
    it('With the correct url', () => {
      expect(createNodeRedisClient).toHaveBeenCalledWith({
        url: 'redis://redis/'
      })
    })
  })
})
