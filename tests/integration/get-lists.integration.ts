import fetch, { Response } from 'node-fetch'
import DatabaseHelper from './helper/DatabaseHelper'
import { List } from '../../src/types'

const url = 'http://localhost:3000/dev/v1/list'

let listDB: DatabaseHelper<List>

beforeAll(() => {
  listDB = new DatabaseHelper<List>('all_lists')
})

afterAll(async () => {
  await listDB.close()
})

describe('When I make a request to the get lists endpoint', () => {
  let response: Response
  let body: object

  describe('And there are no lists in the database', () => {
    beforeEach(async () => {
      await listDB.clear()
      response = await fetch(url)
      body = await response.json()
    })

    it('Then the status code is 200', () => {
      expect(response.status).toBe(200)
    })

    it('And the body contains an empty array', () => {
      expect(body).toEqual([])
    })
  })

  describe('And there lists in the database', () => {
    const lists: List[] = [
      { key: 'test_list_one' },
      { key: 'test_list_two' },
      { key: 'test_list_three' }
    ]

    beforeEach(async () => {
      await listDB.clear()
      await listDB.add(...lists)
      response = await fetch(url)
      body = await response.json()
    })

    it('Then the status code is 200', () => {
      expect(response.status).toBe(200)
    })

    it('And the body contains an empty array', () => {
      expect(body).toEqual(lists)
    })
  })
})
