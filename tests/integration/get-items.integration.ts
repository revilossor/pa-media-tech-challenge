import fetch, { Response } from 'node-fetch'
import DatabaseHelper from './helper/DatabaseHelper'
import { List, Item } from '../../src/types'

const listKey = 'create-item-test-list'
const itemKey = 'create-item-test-item'
const value = 'create-item-test-value'

const url = `http://localhost:3000/dev/v1/list/${listKey}`

let listDB: DatabaseHelper<List>
let itemDB: DatabaseHelper<Item>

beforeAll(async () => {
  listDB = new DatabaseHelper<List>('all_lists')
  itemDB = new DatabaseHelper<Item>(listKey)
  await listDB.add({ key: listKey })
})

afterAll(async () => {
  await listDB.clear()
  await itemDB.clear()
  await listDB.close()
  await itemDB.close()
})

const item: Item = {
  key: itemKey,
  listKey,
  value,
  createdAt: 'now',
  updatedAt: 'now'
}

describe('When I make a request to the get items endpoint', () => {
  let response: Response

  describe('And there are items in the database', () => {
    beforeEach(async () => {
      await itemDB.add(item)
      response = await fetch(url)
    })

    it('Then the status code is 200', () => {
      expect(response.status).toBe(200)
    })

    it('And the body contains the list of all items', async () => {
      const items = await response.json()
      expect(items).toEqual([item])
    })
  })

  describe('And the item database is empty', () => {
    beforeEach(async () => {
      await itemDB.clear()
      response = await fetch(url)
    })

    it('Then the status code is 200', () => {
      expect(response.status).toBe(200)
    })

    it('And the body contains an empty list', async () => {
      const items = await response.json()
      expect(items).toEqual([])
    })
  })

  describe('And the specified list does not exist', () => {
    beforeEach(async () => {
      await listDB.clear()
      response = await fetch(url)
    })

    it('Then the status code is 404', () => {
      expect(response.status).toBe(404)
    })

    it('And the body contains an informative message', async () => {
      const body = await response.json()
      expect(body).toEqual({
        message: `unable to find list "${listKey}"`
      })
    })
  })
})
