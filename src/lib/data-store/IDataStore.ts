export interface KeyedObject {
  [index: string]: any
  key: string
}

export default interface IDataStore<T extends KeyedObject> {
  create: (item: T) => Promise<T[]>
  update: (key: string, item: T) => Promise<T[]>
  remove: (key: string) => Promise<void>
  find: (key: string) => Promise<T[]>
  list: () => Promise<T[]>
}
