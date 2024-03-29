import { Item } from '../../types'
import { KeyedObject } from '../data-store/IDataStore'
import RedisDataStore from '../data-store/RedisDataStore'
import Repository from './Repository'

interface CreateItemParams extends KeyedObject {
  listKey: string
  value: string
}

export default class ItemRepository extends Repository<Item> {
  private getTimestamp (): string {
    return `${new Date().toISOString()}`
  }

  public async create (item: CreateItemParams): Promise<Item[]> {
    const now = this.getTimestamp()
    return await super.create({
      ...item,
      createdAt: now,
      updatedAt: now
    })
  }

  public async update (item: KeyedObject): Promise<Item[]> {
    const now = this.getTimestamp()
    return await super.update({
      ...item,
      updatedAt: now
    } as unknown as Item)
  }

  public async remove (key: string): Promise<void> {
    return await super.remove(key)
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
