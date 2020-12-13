import fetch, { Response } from 'node-fetch'
import DatabaseHelper from './helper/DatabaseHelper'
import { List, Item } from '../../src/types'

const listKey = 'update-item-test-list'
const itemKey = 'update-item-test-item'
const value = 'update-item-test-value'
const updatedValue = 'update-item-test-value-update'

const url = `http://localhost:3000/dev/v1/list/${listKey}/item/${itemKey}`

let listDB: DatabaseHelper<List>
let itemDB: DatabaseHelper<Item>

beforeAll(() => {
  listDB = new DatabaseHelper<List>('all_lists')
  itemDB = new DatabaseHelper<Item>(listKey)
})

afterAll(async () => {
  await listDB.clear()
  await itemDB.clear()
  await listDB.close()
  await itemDB.close()
})

describe('When I make a request to the update item endpoint', () => {
  let response: Response

  describe('And the item to update exists', () => {
    beforeEach(async () => {
      await listDB.add({ key: listKey })
      await itemDB.add({
        key: itemKey,
        listKey,
        value,
        createdAt: 'now',
        updatedAt: 'now'
      })
      response = await fetch(url, {
        method: 'patch',
        body: JSON.stringify({
          value: updatedValue
        })
      })
    })

    it('Then the item is updated, including the updatedAt property', async () => {
      const [item] = await itemDB.find(itemKey)
      expect(item).toEqual({
        key: itemKey,
        listKey,
        value: updatedValue,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })
      expect(item.updatedAt).not.toBe('now')
    })

    it('And the status code is 200', () => {
      expect(response.status).toBe(200)
    })

    it('And the body contains the updated item', async () => {
      const [item] = await response.json()
      expect(item).toEqual({
        key: itemKey,
        listKey,
        value: updatedValue,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })
    })
  })

  describe('And the payload does not contain a value property', () => {
    beforeEach(async () => {
      await listDB.add({ key: listKey })
      response = await fetch(url, {
        method: 'patch'
      })
    })

    it('Then the status code is 400', () => {
      expect(response.status).toBe(400)
    })

    it('And the body contains an informative message', async () => {
      const body = await response.json()
      expect(body).toEqual({
        message: 'unable to extract item value from request body'
      })
    })
  })

  describe('And the specified list does not exist', () => {
    beforeEach(async () => {
      await listDB.clear()
      response = await fetch(url, {
        method: 'patch',
        body: JSON.stringify({
          value
        })
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

  describe('And the item to update does not exist', () => {
    beforeEach(async () => {
      await listDB.add({ key: listKey })
      await itemDB.clear()
      response = await fetch(url, {
        method: 'patch',
        body: JSON.stringify({
          value
        })
      })
    })

    it('Then an item is created, but with no creation time', async () => {
      const [item] = await itemDB.find(itemKey)
      expect(item).toEqual({
        key: itemKey,
        listKey,
        value,
        updatedAt: expect.any(String)
      })
    })

    it('And the status code is 200', () => {
      expect(response.status).toBe(200)
    })

    it('And the body contains the updated item', async () => {
      const [item] = await response.json()
      expect(item).toEqual({
        key: itemKey,
        listKey,
        value,
        updatedAt: expect.any(String)
      })
    })
  })
})
