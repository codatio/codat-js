import { uat, production, apiClient } from '../src/codat'
import should from 'should'

describe('Api client providers', () => {
  const TEST_API_KEY = 'TEST_API_KEY'
  const TEST_COMPANY_ID = 'c0c0c0c0-0000-4000-0000-0000000c0da7'
  const TEST_DATACONNECTION_ID = 'dadadada-0000-4000-0000-0000000c0da7'
  let API_UNDER_TEST = null

  describe('api client selector', () => {
    it('uat should exist', () => {
      should.exist(apiClient('uat'))
    })

    it('poduction should exist', () => {
      should.exist(apiClient('production'))
    })

    it('fake environment should not exist', () => {
      should.not.exist(apiClient('FAKE_ENVIRONMENT'))
    })
  })

  describe('uat', () => {
    beforeEach(() => {
      API_UNDER_TEST = uat(TEST_API_KEY)
    })

    it('should exist', () => {
      should.exist(API_UNDER_TEST)
    });

    ['getCompanies',
      'addCompany',
      'getCompany',
      'updateCompany',
      'removeCompany',
      'getCompanySettings',
      'updateCompanySettings',
      'getCompanyDataStatus'].forEach((propertyName) => {
        it(propertyName + ' promise provider should exist', () => {
          API_UNDER_TEST.should.have.property(propertyName)
        })
      })

    describe('company api', () => {
      beforeEach(() => {
        API_UNDER_TEST = API_UNDER_TEST.companyDataClient(TEST_COMPANY_ID)
      })

      it('should exist', () => {
        should.exist(API_UNDER_TEST)
      })

      it('should contain data GET', () => {
        API_UNDER_TEST.should.have.property('get')
      })

      it('should contain data POST', () => {
        API_UNDER_TEST.should.have.property('post')
      })

      it('should contain data PUT', () => {
        API_UNDER_TEST.should.have.property('put')
      })

      it('should contain data DELETE', () => {
        API_UNDER_TEST.should.have.property('delete')
      })

      it('should have correct base url', () => {
        API_UNDER_TEST.__baseUrl.should.be.exactly(`https://api-uat.codat.io/companies/${TEST_COMPANY_ID}/data`)
      })

      it('should have given api key', () => {
        API_UNDER_TEST.__apiKey.should.be.exactly(TEST_API_KEY)
      })
    });

    describe('data connection api', () => {
      beforeEach(() => {
        API_UNDER_TEST = API_UNDER_TEST.dataConnectionDataClient(TEST_COMPANY_ID, TEST_DATACONNECTION_ID)
      })

      it('should exist', () => {
        should.exist(API_UNDER_TEST)
      })

      it('should contain data GET', () => {
        API_UNDER_TEST.should.have.property('get')
      })

      it('should contain data POST', () => {
        API_UNDER_TEST.should.have.property('post')
      })

      it('should contain data PUT', () => {
        API_UNDER_TEST.should.have.property('put')
      })

      it('should contain data DELETE', () => {
        API_UNDER_TEST.should.have.property('delete')
      })

      it('should have correct base url', () => {
        API_UNDER_TEST.__baseUrl.should.be.exactly(`https://api-uat.codat.io/companies/${TEST_COMPANY_ID}/connections/${TEST_DATACONNECTION_ID}/data`)
      })

      it('should have given api key', () => {
        API_UNDER_TEST.__apiKey.should.be.exactly(TEST_API_KEY)
      })
    });
  })

  describe('production', () => {
    beforeEach(() => {
      API_UNDER_TEST = production(TEST_API_KEY)
    })

    it('should exist', () => {
      should.exist(API_UNDER_TEST)
    });

    ['getCompanies',
      'addCompany',
      'getCompany',
      'updateCompany',
      'removeCompany',
      'getCompanySettings',
      'updateCompanySettings',
      'getCompanyDataStatus'].forEach((propertyName) => {
        it(propertyName + ' promise provider should exist', () => {
          API_UNDER_TEST.should.have.property(propertyName)
        })
      })

    describe('company api', () => {
      beforeEach(() => {
        API_UNDER_TEST = API_UNDER_TEST.companyDataClient(TEST_COMPANY_ID)
      })

      it('should exist', () => {
        should.exist(API_UNDER_TEST)
      })

      it('should contain data GET', () => {
        API_UNDER_TEST.should.have.property('get')
      })

      it('should contain data POST', () => {
        API_UNDER_TEST.should.have.property('post')
      })

      it('should contain data PUT', () => {
        API_UNDER_TEST.should.have.property('put')
      })

      it('should contain data DELETE', () => {
        API_UNDER_TEST.should.have.property('delete')
      })

      it('should have correct base url', () => {
        API_UNDER_TEST.__baseUrl.should.be.exactly(`https://api.codat.io/companies/${TEST_COMPANY_ID}/data`)
      })

      it('should have given api key', () => {
        API_UNDER_TEST.__apiKey.should.be.exactly(TEST_API_KEY)
      })
    });

    describe('data connection api', () => {
      beforeEach(() => {
        API_UNDER_TEST = API_UNDER_TEST.dataConnectionDataClient(TEST_COMPANY_ID, TEST_DATACONNECTION_ID)
      })

      it('should exist', () => {
        should.exist(API_UNDER_TEST)
      })

      it('should contain data GET', () => {
        API_UNDER_TEST.should.have.property('get')
      })

      it('should contain data POST', () => {
        API_UNDER_TEST.should.have.property('post')
      })

      it('should contain data PUT', () => {
        API_UNDER_TEST.should.have.property('put')
      })

      it('should contain data DELETE', () => {
        API_UNDER_TEST.should.have.property('delete')
      })

      it('should have correct base url', () => {
        API_UNDER_TEST.__baseUrl.should.be.exactly(`https://api.codat.io/companies/${TEST_COMPANY_ID}/connections/${TEST_DATACONNECTION_ID}/data`)
      })

      it('should have given api key', () => {
        API_UNDER_TEST.__apiKey.should.be.exactly(TEST_API_KEY)
      })
    });
  })
})
