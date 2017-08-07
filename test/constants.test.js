import { constants } from '../src/codat'
import should from 'should'

describe('Constants', () => {
  it('should export constants obect', () => {
    should.exist(constants)
  })

  it('should export datasets constants obect', () => {
    should.exist(constants.datasets)
  })
})
