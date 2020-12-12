import IDataStore, { KeyedObject } from '../../../src/lib/data-store/IDataStore'
import RedisDataStore from '../../../src/lib/data-store/RedisDataStore'

export default class DatabaseHelper<T extends KeyedObject> {
  private readonly store: IDataStore<T>

  constructor (id: string) {
    this.store = new RedisDataStore(id, 'localhost')
  }

  public async clear (): Promise<void> {
    const items = await this.store.list()
    while (items.length > 0) {
      const item = items.pop()
      if (item !== undefined) {
        await this.store.remove(item.key)
      }
    }
  }

  public async add (...items: T[]): Promise<void> {
    while (items.length > 0) {
      const item = items.pop()
      if (item !== undefined) {
        await this.store.create(item)
      }
    }
  }

  public async close (): Promise<void> {
    await this.store.close()
  }
}
