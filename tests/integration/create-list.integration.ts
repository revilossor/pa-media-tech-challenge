import fetch, { Response } from 'node-fetch'
import DatabaseHelper from './helper/DatabaseHelper'
import { List } from '../../src/types'

const key = 'create-list-test'

const url = `http://localhost:3000/dev/v1/list/${key}`

let listDB: DatabaseHelper<List>

beforeAll(() => {
  listDB = new DatabaseHelper<List>('all_lists')
})

afterAll(async () => {
  await listDB.clear()
  await listDB.close()
})

describe('When I make a request to the create list endpoint', () => {
  let response: Response

  beforeEach(async () => {
    response = await fetch(url, {
      method: 'put'
    })
  })

  it('Then a list is created with the correct key', async () => {
    const item = await listDB.find(key)
    expect(item).toEqual([{ key }])
  })

  it('And the status code is 200', () => {
    expect(response.status).toBe(200)
  })

  it('And the body contains the created list', async () => {
    const body = await response.json()
    expect(body).toEqual([{ key }])
  })
})
