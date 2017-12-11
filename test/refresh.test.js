import should from 'should'
import { uat } from '../src/codat'
import {
    constants,
    RefreshAllDatasets,
    RefreshDataset
 } from '../src/codat-refresh'

describe('Refresh', () => {
  const COMPANY_ID = 'COMPANY_ID'

  let REFRESH_UNDER_TEST = null

  describe('all', () => {
    beforeEach(() => {
      REFRESH_UNDER_TEST = new RefreshAllDatasets(COMPANY_ID)
    })

    it('should map to the right resource', () => {
      REFRESH_UNDER_TEST.getResource().should.be.exactly(constants.ALL)
    })
  })

  describe('specific dataset', () => {
    const DATASET_NAME = 'DATASET_NAME'

    beforeEach(() => {
      REFRESH_UNDER_TEST = new RefreshDataset(COMPANY_ID, DATASET_NAME)
    })

    it('should map to the right resource', () => {
      REFRESH_UNDER_TEST.getResource().should.be.exactly(`${constants.QUEUE}/${DATASET_NAME}`)
    })
  })

  describe('company/info dataset', () => {
    const API_NAME = 'info'
    const DATASET_NAME = 'company'

    beforeEach(() => {
      REFRESH_UNDER_TEST = new RefreshDataset(COMPANY_ID, API_NAME)
    })

    it('should mapp to the right resource, with correct data type name', () => {
      REFRESH_UNDER_TEST.getResource().should.be.exactly(`${constants.QUEUE}/${DATASET_NAME}`)
    })
  })
})
