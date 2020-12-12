import IDataStore, { KeyedObject } from './IDataStore'
import { createNodeRedisClient, WrappedNodeRedisClient } from 'handy-redis'

export default class RedisDataStore<T extends KeyedObject> implements IDataStore<T> {
  private readonly client: WrappedNodeRedisClient

  public constructor (private readonly id: string) {
    this.client = createNodeRedisClient({
      url: 'redis://redis/'
    })
  }

  private getStoreSpecificKey (key: string): string {
    return `${this.id}::${key}`
  }

  private async set (item: T): Promise<T[]> {
    await this.client.set(
      this.getStoreSpecificKey(item.key),
      JSON.stringify(item)
    )
    return [item]
  }

  public async create (item: T): Promise<T[]> {
    return await this.set(item)
  }

  public async update (_key: string, item: T): Promise<T[]> {
    return await this.set(item)
  }

  public async remove (key: string): Promise<void> {
    await this.client.del(
      this.getStoreSpecificKey(key)
    )
  }

  public async find (key: string): Promise<T[]> {
    const item = await this.client.get(
      this.getStoreSpecificKey(key)
    )
    return item == null ? [] : [JSON.parse(item)]
  }

  public async list (): Promise<T[]> {
    const keys = await this.client.keys(`${this.id}::*`)
    const shortKeys = keys.map(key => key.split('::').pop())
    let list: T[] = []
    for (const key of shortKeys) {
      if (key !== undefined && key.length > 0) {
        const item = await this.find(key)
        list = [...list, ...item]
      } else {
        throw Error('malformed key')
      }
    }
    return list
  }
}
