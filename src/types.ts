import { KeyedObject } from './lib/data-store/IDataStore'

export interface Item extends KeyedObject {
  listKey: string
  value: string
  createdAt: string
  updatedAt: string
}

export type List = KeyedObject
