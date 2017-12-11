import { constants } from '../src/codat'
import should from 'should'

describe('Constants', () => {
  it('should export constants obect', () => {
    should.exist(constants)
  })

  it('should export companies constant', () => {
    should.exist(constants.COMPANIES)
  })

  it('should export uat constant', () => {
    should.exist(constants.UAT)
  })

  it('should export production constant', () => {
    should.exist(constants.PRODUCTION)
  })
})
