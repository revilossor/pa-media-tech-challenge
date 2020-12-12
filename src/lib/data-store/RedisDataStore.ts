import IDataStore, { KeyedObject } from './IDataStore'
import { createNodeRedisClient, WrappedNodeRedisClient } from 'handy-redis'

export default class RedisDataStore<T extends KeyedObject> implements IDataStore<T> {
  private readonly client: WrappedNodeRedisClient

  public constructor () {
    this.client = createNodeRedisClient({
      url: 'redis://redis/'
    })
  }

  private async set (item: T): Promise<T[]> {
    await this.client.set(
      item.key,
      JSON.stringify(item)
    )
    return [item]
  }

  public async create (item: T): Promise<T[]> {
    return await this.set(item)
  }

  public async update (key: string, item: T): Promise<T[]> {
    return await this.set(item)
  }

  public async remove (key: string): Promise<void> {
    await this.client.del(key)
  }

  public async find (key: string): Promise<T[]> {
    const item = await this.client.get(key)
    return item == null ? [] : [JSON.parse(item)]
  }

  public async list (): Promise<T[]> {
    return []
  }
}
