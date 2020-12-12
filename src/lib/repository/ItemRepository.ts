import { Item } from '../../types'
import RedisDataStore from '../data-store/RedisDataStore'
import Repository from './Repository'

export default class ItemRepository extends Repository<Item> {
  private getTimestamp (): string {
    return `${new Date().toISOString()}`
  }

  public async create (item: Item): Promise<Item[]> {
    const now = this.getTimestamp()
    return await super.create({
      ...item,
      createdAt: now,
      updatedAt: now
    })
  }

  public async update (item: Item): Promise<Item[]> {
    const now = this.getTimestamp()
    return await super.update({
      ...item,
      updatedAt: now
    })
  }

  public async remove (item: Item): Promise<void> {
    return await super.remove(item)
  }

  public async list (): Promise<Item[]> {
    return await super.list()
  }

  public async close (): Promise<void> {
    return await super.close()
  }

  public static fromId (id: string): ItemRepository {
    const store = new RedisDataStore<Item>(id, 'redis')
    return new ItemRepository(store)
  }
}
