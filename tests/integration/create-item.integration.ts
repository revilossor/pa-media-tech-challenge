import fetch, { Response } from 'node-fetch'
import DatabaseHelper from './helper/DatabaseHelper'
import { List, Item } from '../../src/types'

const listKey = 'create-item-test-list'
const itemKey = 'create-item-test-item'
const value = 'create-item-test-value'

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

describe('When I make a request to the create item endpoint', () => {
  let response: Response

  describe('And the payload is valid', () => {
    beforeEach(async () => {
      await itemDB.clear()
      response = await fetch(url, {
        method: 'put',
        body: JSON.stringify({
          value
        })
      })
    })

    it('Then an item is created with the correct key', async () => {
      const [item] = await itemDB.find(itemKey)
      expect(item).toEqual({
        key: itemKey,
        listKey,
        value,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })
    })

    it('And the status code is 200', () => {
      expect(response.status).toBe(200)
    })

    it('And the body contains the created item', async () => {
      const [item] = await response.json()
      expect(item).toEqual({
        key: itemKey,
        listKey,
        value,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })
    })
  })

  describe('And the payload does not contain a value property', () => {
    beforeEach(async () => {
      response = await fetch(url, {
        method: 'put'
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
        method: 'put',
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
})
