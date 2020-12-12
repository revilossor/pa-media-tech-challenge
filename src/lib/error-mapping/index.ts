import { BadRequestError } from './BadRequestError'
import { NotFoundError } from './NotFoundError'

const mapping = new Map([
  [NotFoundError.name, 404],
  [BadRequestError.name, 400]
])

export default mapping

export {
  BadRequestError,
  NotFoundError
}
