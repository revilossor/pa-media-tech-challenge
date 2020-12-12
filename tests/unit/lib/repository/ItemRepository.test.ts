import ItemRepository from '../../../../src/lib/repository/ItemRepository'
import RedisDataStore from '../../../../src/lib/data-store/RedisDataStore'

jest.mock('../../../../src/lib/data-store/RedisDataStore')

const dataStore = {
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  find: jest.fn(),
  list: jest.fn(),
  close: jest.fn()
}

const item = {
  key: 'some item key',
  listKey: 'some list key',
  value: 'some value',
  createdAt: 'some iso time',
  updatedAt: 'some other iso time'
}

describe('When I instantiate an item repository', () => {
  let instance: ItemRepository

  beforeEach(() => {
    instance = new ItemRepository(dataStore)
  })

  describe('And I create an item', () => {
    beforeEach(async () => {
      await instance.create(item)
    })

    it('Then the item is created in the data store', () => {
      expect(dataStore.create).toHaveBeenCalledWith(item)
    })
  })
  describe('And I update an item', () => {
    beforeEach(async () => {
      await instance.update(item)
    })

    it('Then the item is created in the data store', () => {
      expect(dataStore.update).toHaveBeenCalledWith(item.key, item)
    })
  })
  describe('And I remove an item', () => {
    beforeEach(async () => {
      await instance.remove(item)
    })

    it('Then the item is removed in the data store', () => {
      expect(dataStore.remove).toHaveBeenCalledWith(item.key)
    })
  })
  describe('And I list the items', () => {
    beforeEach(async () => {
      await instance.list()
    })

    it('Then the the list is fetched from the data store', () => {
      expect(dataStore.list).toHaveBeenCalled()
    })
  })
  describe('And I close the repository', () => {
    beforeEach(async () => {
      await instance.close()
    })

    it('Then the data store is closed', () => {
      expect(dataStore.close).toHaveBeenCalled()
    })
  })
})

describe('When I get an item repository from an id', () => {
  let instance: ItemRepository

  const id = 'some_id'

  beforeEach(() => {
    instance = ItemRepository.fromId(id)
  })

  it('Then a redis data store is instantiated with the id', () => {
    expect(RedisDataStore).toHaveBeenCalledWith(id)
  })

  it('And an item repository is returned', () => {
    expect(instance).toBeInstanceOf(ItemRepository)
  })
})
