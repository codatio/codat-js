import {
  constants,
  BalanceSheetQuery,
  ProfitAndLossQuery,
  AccountsQuery,
  BankAccountsQuery,
  BankAccountTransactionsQuery,
  InvoiceAttachmentsQuery,
  InvoiceSpecificAttachmentQuery,
  InvoiceDownloadAttachmentQuery,
  InvoicesQuery,
  InvoicePdfQuery,
  CreditNotesQuery,
  CustomersQuery,
  CustomerAttachmentsQuery,
  CustomerSpecificAttachmentQuery,
  CustomerDownloadAttachmentQuery,
  SuppliersQuery,
  SupplierAttachmentsQuery,
  SupplierSpecificAttachmentQuery,
  SupplierDownloadAttachmentQuery,
  BillsQuery,
  BillAttachmentsQuery,
  BillSpecificAttachmentQuery,
  BillDownloadAttachmentQuery,
  CompanyQuery,
  PaymentsQuery,
  BankStatementsQuery,
  ItemsQuery,
  TaxRatesQuery,
  TrackingCategoriesQuery,
  BillCreditNotesQuery,
  PurchaseOrdersQuery
} from '../src/codat-queries'

const FAKE_API = () => {
  return {
    companyDataClientCalled: false,
    companyDataClient (companyId) {
      this.companyDataClientCalled = true
      return {
        get: resource => true
      }
    },
    dataConnectionDataClientCalled: false,
    dataConnectionDataClient (companyId, dataConnectionId) {
      this.dataConnectionDataClientCalled = true
      return {
        get: resource => true
      }
    }
  }
}

describe('Queries', () => {
  const TEST_COMPANY_ID = 'c0c0c0c0-0000-4000-0000-0000000c0da7'
  const TEST_RECORD_ID = '10101010-0000-4000-0000-0000000c0da7'
  const TEST_DATACONNECTION_ID = 'dadadada-0000-4000-0000-0000000c0da7'
  const TEST_ATTACHMENT_ID = 'a7a7a7a7-0000-4000-0000-0000000c0da7'

  let QUERY_UNDER_TEST = null
  let FAKE_API_CLIENT = null

  describe('financial', () => {
    const PERIOD_LENGTH = 0
    const PERIODS_TO_COMPARE = 0
    const START_MONTH = new Date();

    [
      [BalanceSheetQuery, constants.BALANCE_SHEET],
      [ProfitAndLossQuery, constants.PROFIT_AND_LOSS]
    ].forEach(queryTestParameters => {
      const queryName = queryTestParameters[0].name
      const QueryConstructor = queryTestParameters[0]
      const resourceRoute = queryTestParameters[1]

      describe(queryName, () => {
        beforeEach(() => {
          QUERY_UNDER_TEST = new QueryConstructor(
            TEST_COMPANY_ID,
            PERIOD_LENGTH,
            PERIODS_TO_COMPARE,
            START_MONTH)
          FAKE_API_CLIENT = new FAKE_API()
        })

        it(`should direct to ${queryName} resource`, () => {
          QUERY_UNDER_TEST.getResource().should.be.exactly(resourceRoute)
        })

        it(`should provide ${queryName} argument object`, () => {
          QUERY_UNDER_TEST.generateArgs().should.eql({
            periodLength: PERIOD_LENGTH,
            periodsToCompare: PERIODS_TO_COMPARE,
            startMonth: START_MONTH
          })
        })

        it('should use the company data client to run', () => {
          QUERY_UNDER_TEST.run(FAKE_API_CLIENT)
          FAKE_API_CLIENT.companyDataClientCalled.should.eql(true)
          FAKE_API_CLIENT.dataConnectionDataClientCalled.should.eql(false)
        })
      })
    })
  })

  describe('flexible', () => {
    // In the query string of a flexible query you are able to specify your
    // own filters based on properties and values of the data type that
    // you are querying. Each data type therefore must have a query string
    // that matches it's values and properties, the string below is only
    // representative. Supported value types are numbers, strings, and datetimes.
    const QUERY_STRING = "Property1<100,Property2>100,Property3='value'"
    const PAGE_SIZE = 1000
    const PAGE_NUMBER = 1;

    [
      [InvoicesQuery, constants.INVOICES],
      [CreditNotesQuery, constants.CREDIT_NOTES],
      [CustomersQuery, constants.CUSTOMERS],
      [SuppliersQuery, constants.SUPPLIERS],
      [BillsQuery, constants.BILLS],
      [PaymentsQuery, constants.PAYMENTS],
      [ItemsQuery, constants.ITEMS],
      [TaxRatesQuery, constants.TAX_RATES],
      [TrackingCategoriesQuery, constants.TRACKING_CATEGORIES],
      [BillCreditNotesQuery, constants.BILL_CREDIT_NOTES],
      [PurchaseOrdersQuery, constants.PURCHASE_ORDERS]
    ].forEach(queryTestParameters => {
      const queryName = queryTestParameters[0].name
      const QueryConstructor = queryTestParameters[0]
      const resourceRoute = queryTestParameters[1]

      describe(queryName, () => {
        beforeEach(() => {
          QUERY_UNDER_TEST = new QueryConstructor(
            TEST_COMPANY_ID,
            QUERY_STRING,
            PAGE_NUMBER,
            PAGE_SIZE)
          FAKE_API_CLIENT = new FAKE_API()
        })

        it(`should direct to ${queryName} resource`, () => {
          QUERY_UNDER_TEST.getResource().should.be.exactly(resourceRoute)
        })

        it(`should provide ${queryName} argument object`, () => {
          QUERY_UNDER_TEST.generateArgs().should.eql({
            query: QUERY_STRING,
            page: PAGE_NUMBER,
            pageSize: PAGE_SIZE
          })
        })

        it('should use the company data client to run', () => {
          QUERY_UNDER_TEST.run(FAKE_API_CLIENT)
          FAKE_API_CLIENT.companyDataClientCalled.should.eql(true)
          FAKE_API_CLIENT.dataConnectionDataClientCalled.should.eql(false)
        })
      })
    })
  })

  describe('flexible with data connection', () => {
    const QUERY_STRING = "Property1<100,Property2>100,Property3='value'"
    const PAGE_SIZE = 1000
    const PAGE_NUMBER = 1;

    [
      [BankAccountsQuery, constants.BANK_ACCOUNTS]
    ].forEach(queryTestParameters => {
      const queryName = queryTestParameters[0].name
      const QueryConstructor = queryTestParameters[0]
      const resourceRoute = queryTestParameters[1]

      describe(queryName, () => {
        beforeEach(() => {
          QUERY_UNDER_TEST = new QueryConstructor(
            TEST_COMPANY_ID,
            TEST_DATACONNECTION_ID,
            QUERY_STRING,
            PAGE_NUMBER,
            PAGE_SIZE)
          FAKE_API_CLIENT = new FAKE_API()
        })

        it(`should direct to ${queryName} resource`, () => {
          QUERY_UNDER_TEST.getResource().should.be.exactly(resourceRoute)
        })

        it(`should provide ${queryName} argument object`, () => {
          QUERY_UNDER_TEST.generateArgs().should.eql({
            query: QUERY_STRING,
            page: PAGE_NUMBER,
            pageSize: PAGE_SIZE
          })
        })

        it('should use the data connection data client to run', () => {
          QUERY_UNDER_TEST.run(FAKE_API_CLIENT)
          FAKE_API_CLIENT.dataConnectionDataClientCalled.should.eql(true)
          FAKE_API_CLIENT.companyDataClientCalled.should.eql(false)
        })
      })
    })
  })

  describe('flexible with data connection and record ID', () => {
    const QUERY_STRING = "Property1<100,Property2>100,Property3='value'"
    const PAGE_SIZE = 1000
    const PAGE_NUMBER = 1;

    [
      [BankAccountTransactionsQuery, `${constants.BANK_ACCOUNTS}/${TEST_RECORD_ID}/${constants.BANK_TRANSACTIONS}`]
    ].forEach(queryTestParameters => {
      const queryName = queryTestParameters[0].name
      const QueryConstructor = queryTestParameters[0]
      const resourceRoute = queryTestParameters[1]

      describe(queryName, () => {
        beforeEach(() => {
          QUERY_UNDER_TEST = new QueryConstructor(
            TEST_COMPANY_ID,
            TEST_DATACONNECTION_ID,
            TEST_RECORD_ID,
            QUERY_STRING,
            PAGE_NUMBER,
            PAGE_SIZE)
          FAKE_API_CLIENT = new FAKE_API()
        })

        it(`should direct to ${queryName} resource`, () => {
          QUERY_UNDER_TEST.getResource().should.be.exactly(resourceRoute)
        })

        it(`should provide ${queryName} argument object`, () => {
          QUERY_UNDER_TEST.generateArgs().should.eql({
            query: QUERY_STRING,
            page: PAGE_NUMBER,
            pageSize: PAGE_SIZE
          })
        })

        it('should use the data connection data client to run', () => {
          QUERY_UNDER_TEST.run(FAKE_API_CLIENT)
          FAKE_API_CLIENT.dataConnectionDataClientCalled.should.eql(true)
          FAKE_API_CLIENT.companyDataClientCalled.should.eql(false)
        })
      })
    })
  })

  describe('basic', () => {
    [
      [AccountsQuery, constants.CHART_OF_ACCOUNTS],
      [CompanyQuery, constants.COMPANY]
    ].forEach(queryTestParameters => {
      const queryName = queryTestParameters[0].name
      const QueryConstructor = queryTestParameters[0]
      const resourceRoute = queryTestParameters[1]

      describe(queryName, () => {
        beforeEach(() => {
          QUERY_UNDER_TEST = new QueryConstructor(
            TEST_COMPANY_ID)
          FAKE_API_CLIENT = new FAKE_API()
        })

        it(`should direct to ${queryName} resource`, () => {
          QUERY_UNDER_TEST.getResource().should.be.exactly(resourceRoute)
        })

        it(`should provide ${queryName} argument object`, () => {
          QUERY_UNDER_TEST.generateArgs().should.eql({})
        })

        it('should use the company data client to run', () => {
          QUERY_UNDER_TEST.run(FAKE_API_CLIENT)
          FAKE_API_CLIENT.companyDataClientCalled.should.eql(true)
          FAKE_API_CLIENT.dataConnectionDataClientCalled.should.eql(false)
        })
      })
    })
  })

  describe('basic with id', () => {
    [
      [InvoicePdfQuery, `${constants.INVOICES}/${TEST_RECORD_ID}/pdf`]
    ].forEach(queryTestParameters => {
      const queryName = queryTestParameters[0].name
      const QueryConstructor = queryTestParameters[0]
      const resourceRoute = queryTestParameters[1]

      describe(queryName, () => {
        beforeEach(() => {
          QUERY_UNDER_TEST = new QueryConstructor(
            TEST_COMPANY_ID,
            TEST_RECORD_ID
          )
          FAKE_API_CLIENT = new FAKE_API()
        })

        it(`should direct to ${queryName} resource`, () => {
          QUERY_UNDER_TEST.getResource().should.be.exactly(resourceRoute)
        })

        it(`should provide ${queryName} argument object`, () => {
          QUERY_UNDER_TEST.generateArgs().should.eql({})
        })

        it('should use the company data client to run', () => {
          QUERY_UNDER_TEST.run(FAKE_API_CLIENT)
          FAKE_API_CLIENT.companyDataClientCalled.should.eql(true)
          FAKE_API_CLIENT.dataConnectionDataClientCalled.should.eql(false)
        })
      })
    })
  })

  describe('list attachments', () => {
    [
      [InvoiceAttachmentsQuery, `${constants.INVOICES}/${TEST_RECORD_ID}/attachments`],
      [BillAttachmentsQuery, `${constants.BILLS}/${TEST_RECORD_ID}/attachments`],
      [CustomerAttachmentsQuery, `${constants.CUSTOMERS}/${TEST_RECORD_ID}/attachments`],
      [SupplierAttachmentsQuery, `${constants.SUPPLIERS}/${TEST_RECORD_ID}/attachments`]
    ].forEach(queryTestParameters => {
      const queryName = queryTestParameters[0].name
      const QueryConstructor = queryTestParameters[0]
      const resourceRoute = queryTestParameters[1]

      describe(queryName, () => {
        beforeEach(() => {
          QUERY_UNDER_TEST = new QueryConstructor(
            TEST_COMPANY_ID,
            TEST_DATACONNECTION_ID,
            TEST_RECORD_ID)
          FAKE_API_CLIENT = new FAKE_API()
        })

        it(`should direct to ${queryName} resource`, () => {
          QUERY_UNDER_TEST.getResource().should.be.exactly(resourceRoute)
        })

        it(`should provide ${queryName} argument object`, () => {
          QUERY_UNDER_TEST.generateArgs().should.eql({})
        })

        it('should use the data connection data client to run', () => {
          QUERY_UNDER_TEST.run(FAKE_API_CLIENT)
          FAKE_API_CLIENT.dataConnectionDataClientCalled.should.eql(true)
          FAKE_API_CLIENT.companyDataClientCalled.should.eql(false)
        })
      })
    })
  })

  describe('get specific attachment metadata', () => {
    [
      [InvoiceSpecificAttachmentQuery, `${constants.INVOICES}/${TEST_RECORD_ID}/attachments/${TEST_ATTACHMENT_ID}`],
      [BillSpecificAttachmentQuery, `${constants.BILLS}/${TEST_RECORD_ID}/attachments/${TEST_ATTACHMENT_ID}`],
      [CustomerSpecificAttachmentQuery, `${constants.CUSTOMERS}/${TEST_RECORD_ID}/attachments/${TEST_ATTACHMENT_ID}`],
      [SupplierSpecificAttachmentQuery, `${constants.SUPPLIERS}/${TEST_RECORD_ID}/attachments/${TEST_ATTACHMENT_ID}`]
    ].forEach(queryTestParameters => {
      const queryName = queryTestParameters[0].name
      const QueryConstructor = queryTestParameters[0]
      const resourceRoute = queryTestParameters[1]

      describe(queryName, () => {
        beforeEach(() => {
          QUERY_UNDER_TEST = new QueryConstructor(
            TEST_COMPANY_ID,
            TEST_DATACONNECTION_ID,
            TEST_RECORD_ID,
            TEST_ATTACHMENT_ID)
          FAKE_API_CLIENT = new FAKE_API()
        })

        it(`should direct to ${queryName} resource`, () => {
          QUERY_UNDER_TEST.getResource().should.be.exactly(resourceRoute)
        })

        it(`should provide ${queryName} argument object`, () => {
          QUERY_UNDER_TEST.generateArgs().should.eql({})
        })

        it('should use the data connection data client to run', () => {
          QUERY_UNDER_TEST.run(FAKE_API_CLIENT)
          FAKE_API_CLIENT.dataConnectionDataClientCalled.should.eql(true)
          FAKE_API_CLIENT.companyDataClientCalled.should.eql(false)
        })
      })
    })
  })

  describe('download attachment', () => {
    [
      [InvoiceDownloadAttachmentQuery, `${constants.INVOICES}/${TEST_RECORD_ID}/attachments/${TEST_ATTACHMENT_ID}/download`],
      [BillDownloadAttachmentQuery, `${constants.BILLS}/${TEST_RECORD_ID}/attachments/${TEST_ATTACHMENT_ID}/download`],
      [CustomerDownloadAttachmentQuery, `${constants.CUSTOMERS}/${TEST_RECORD_ID}/attachments/${TEST_ATTACHMENT_ID}/download`],
      [SupplierDownloadAttachmentQuery, `${constants.SUPPLIERS}/${TEST_RECORD_ID}/attachments/${TEST_ATTACHMENT_ID}/download`]
    ].forEach(queryTestParameters => {
      const queryName = queryTestParameters[0].name
      const QueryConstructor = queryTestParameters[0]
      const resourceRoute = queryTestParameters[1]

      describe(queryName, () => {
        beforeEach(() => {
          QUERY_UNDER_TEST = new QueryConstructor(
            TEST_COMPANY_ID,
            TEST_DATACONNECTION_ID,
            TEST_RECORD_ID,
            TEST_ATTACHMENT_ID)
          FAKE_API_CLIENT = new FAKE_API()
        })

        it(`should direct to ${queryName} resource`, () => {
          QUERY_UNDER_TEST.getResource().should.be.exactly(resourceRoute)
        })

        it(`should provide ${queryName} argument object`, () => {
          QUERY_UNDER_TEST.generateArgs().should.eql({})
        })

        it('should use the data connection data client to run', () => {
          QUERY_UNDER_TEST.run(FAKE_API_CLIENT)
          FAKE_API_CLIENT.dataConnectionDataClientCalled.should.eql(true)
          FAKE_API_CLIENT.companyDataClientCalled.should.eql(false)
        })
      })
    })
  })
})
