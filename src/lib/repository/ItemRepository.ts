import { Item } from '../../types'
import RedisDataStore from '../data-store/RedisDataStore'
import Repository from './Repository'

export default class ItemRepository extends Repository<Item> {
  public async create (item: Item): Promise<Item[]> {
    return await super.create(item)
  }

  public async update (item: Item): Promise<Item[]> {
    return await super.update(item)
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
    const store = new RedisDataStore<Item>(id)
    return new ItemRepository(store)
  }
}
