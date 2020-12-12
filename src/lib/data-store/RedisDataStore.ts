import IDataStore, { KeyedObject } from './IDataStore'
import { createNodeRedisClient, WrappedNodeRedisClient } from 'handy-redis'

export default class RedisDataStore<T extends KeyedObject> implements IDataStore<T> {
  private readonly client: WrappedNodeRedisClient

  public constructor () {
    this.client = createNodeRedisClient({
      url: 'redis://redis/'
    })
  }

  public async create (item: T): Promise<T[]> {
    await this.client.set(
      item.key,
      JSON.stringify(item)
    )
    return [item]
  }

  public async update (key: string, item: T): Promise<T[]> {
    return []
  }

  public async remove (key: string): Promise<void> {}

  public async find (key: string): Promise<T[]> {
    return []
  }

  public async list (): Promise<T[]> {
    return []
  }
}
