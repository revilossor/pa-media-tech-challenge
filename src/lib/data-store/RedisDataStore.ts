import IDataStore from './IDataStore'
import { createNodeRedisClient, WrappedNodeRedisClient } from 'handy-redis'

export default class RedisDataStore<T> implements IDataStore<T> {
  private readonly client: WrappedNodeRedisClient

  public constructor () {
    this.client = createNodeRedisClient({
      url: 'redis://redis/'
    })
  }

  public async create (item: T): Promise<T[]> {
    return []
  }

  public async update (key: string, item: T): Promise<T[]> {
    return []
  }

  public async remove (key: string): Promise<void> {

  }

  public async find (key: string): Promise<T[]> {
    return []
  }

  public async list (): Promise<T[]> {
    return []
  }
}
