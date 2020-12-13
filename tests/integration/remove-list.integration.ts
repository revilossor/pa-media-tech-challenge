import fetch, { Response } from 'node-fetch'
import DatabaseHelper from './helper/DatabaseHelper'
import { List } from '../../src/types'

const key = 'remove-list-test'
const url = `http://localhost:3000/dev/v1/list/${key}`

let listDB: DatabaseHelper<List>

beforeAll(() => {
  listDB = new DatabaseHelper<List>('all_lists')
})

afterAll(async () => {
  await listDB.close()
})

describe('When I make a request to the create list endpoint', () => {
  let response: Response

  describe('And the list does not exist', () => {
    beforeEach(async () => {
      await listDB.clear()
      response = await fetch(url, {
        method: 'delete'
      })
    })

    it('Then the status code is 200', () => {
      expect(response.status).toBe(200)
    })

    it('And the body is an array containing the item to remove', async () => {
      const body = await response.json()
      expect(body).toEqual([{ key }])
    })
  })

  describe('And the list exists', () => {
    beforeEach(async () => {
      await listDB.add({ key })
      response = await fetch(url, {
        method: 'delete'
      })
    })

    it('Then the list is removed', async () => {
      const item = await listDB.find(key)
      expect(item).toHaveLength(0)
    })

    it('Then the status code is 200', () => {
      expect(response.status).toBe(200)
    })

    it('And the body is an array containing the item to remove', async () => {
      const body = await response.json()
      expect(body).toEqual([{ key }])
    })
  })
})
