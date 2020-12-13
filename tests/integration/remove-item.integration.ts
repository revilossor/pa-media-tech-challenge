import fetch, { Response } from 'node-fetch'
import DatabaseHelper from './helper/DatabaseHelper'
import { List, Item } from '../../src/types'

const listKey = 'remove-item-test-list'
const itemKey = 'remove-item-test-item'
const value = 'remove-item-test-value'
const createdAt = 'createdAt'
const updatedAt = 'updatedAt'

const url = `http://localhost:3000/dev/v1/list/${listKey}/item/${itemKey}`

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

describe('When I make a request to the remove item endpoint', () => {
  let response: Response

  describe('And there is an item to delete', () => {
    beforeEach(async () => {
      await itemDB.add({
        key: itemKey,
        listKey,
        value,
        createdAt,
        updatedAt
      })
      response = await fetch(url, {
        method: 'delete'
      })
    })

    it('Then the status code is 200', () => {
      expect(response.status).toBe(200)
    })

    it('And the body contains the removed item key', async () => {
      const [item] = await response.json()
      expect(item).toEqual({
        key: itemKey
      })
    })
  })

  describe('And there is no item to delete', () => {
    beforeEach(async () => {
      await itemDB.clear()
      response = await fetch(url, {
        method: 'delete'
      })
    })

    it('Then the status code is 200', () => {
      expect(response.status).toBe(200)
    })

    it('And the body contains the removed item key', async () => {
      const [item] = await response.json()
      expect(item).toEqual({
        key: itemKey
      })
    })
  })

  describe('And the specified list does not exist', () => {
    beforeEach(async () => {
      await listDB.clear()
      response = await fetch(url, {
        method: 'delete'
      })
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
