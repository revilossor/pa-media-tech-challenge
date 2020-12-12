import IDataStore, { KeyedObject } from '../data-store/IDataStore'

export default abstract class Repository<T extends KeyedObject> {
  public constructor (private readonly store: IDataStore<T>) {}
  protected async create (item: T): Promise<T[]> {
    return await this.store.create(item)
  }

  protected async remove (item: T): Promise<void> {
    return await this.store.remove(item.key)
  }

  protected async update (item: T): Promise<T[]> {
    return await this.store.update(item.key, item)
  }

  protected async list (): Promise<T[]> {
    return await this.store.list()
  }

  protected async close (): Promise<void> {
    return await this.store.close()
  }
}
