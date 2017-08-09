import should from 'should'
import { uat, constants } from '../src/codat'
import {
    RefreshAllDatasets,
    RefreshDataset
 } from '../src/codat-refresh'

describe('Refresh', () => {
  const COMPANY_ID = 'COMPANY_ID'
  const API_CLIENT = uat('')

  let REFRESH_UNDER_TEST = null

  describe('all', () => {
    beforeEach(() => {
      REFRESH_UNDER_TEST = new RefreshAllDatasets(COMPANY_ID)
    })

    it('should mapp to the right resource', () => {
      REFRESH_UNDER_TEST.getResource().should.be.exactly(constants.refresh.ALL)
    })
  })

  describe('specific dataset', () => {
    const DATASET_NAME = 'DATASET_NAME'

    beforeEach(() => {
      REFRESH_UNDER_TEST = new RefreshDataset(COMPANY_ID, DATASET_NAME)
    })

    it('should mapp to the right resource', () => {
      REFRESH_UNDER_TEST.getResource().should.be.exactly(`${constants.refresh.QUEUE}/${DATASET_NAME}`)
    })
  })
})
