import { List } from '../../types'
import RedisDataStore from '../data-store/RedisDataStore'
import Repository from './Repository'

export default class ListRepository extends Repository<List> {
  public async create (list: List): Promise<List[]> {
    return await super.create(list)
  }

  public async remove (list: List): Promise<void> {
    return await super.remove(list)
  }

  public async list (): Promise<List[]> {
    return await super.list()
  }

  public async close (): Promise<void> {
    return await super.close()
  }

  public static fromId (id: string): ListRepository {
    const store = new RedisDataStore<List>(id, 'redis')
    return new ListRepository(store)
  }
}
