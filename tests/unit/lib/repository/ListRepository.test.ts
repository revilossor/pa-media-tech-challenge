import ListRepository from '../../../../src/lib/repository/ListRepository'
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

const list = {
  key: 'turtles all the way down'
}

describe('When I instantiate a list repository', () => {
  let instance: ListRepository

  beforeEach(() => {
    instance = new ListRepository(dataStore)
  })

  describe('And I create a list', () => {
    beforeEach(async () => {
      await instance.create(list)
    })

    it('Then the list is created in the data store', () => {
      expect(dataStore.create).toHaveBeenCalledWith(list)
    })
  })
  describe('And I remove a list', () => {
    beforeEach(async () => {
      await instance.remove(list)
    })

    it('Then the list is removed in the data store', () => {
      expect(dataStore.remove).toHaveBeenCalledWith(list.key)
    })
  })
  describe('And I list the lists', () => {
    beforeEach(async () => {
      await instance.list()
    })

    it('Then the lists are fetched from the data store', () => {
      expect(dataStore.list).toHaveBeenCalled()
    })
  })
  describe('And I find a list', () => {
    beforeEach(async () => {
      await instance.find(list.key)
    })

    it('Then data store is used to find the list', () => {
      expect(dataStore.find).toHaveBeenCalledWith(list.key)
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

describe('When I get a list repository from an id', () => {
  let instance: ListRepository

  const id = 'some_id'

  beforeEach(() => {
    instance = ListRepository.fromId(id)
  })

  it('Then a redis data store is instantiated with the id', () => {
    expect(RedisDataStore).toHaveBeenCalledWith(id, 'redis')
  })

  it('And a list repository is returned', () => {
    expect(instance).toBeInstanceOf(ListRepository)
  })
})
