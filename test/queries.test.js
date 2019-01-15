import should from 'should'
import { uat } from '../src/codat'
import {
    constants,
    BalanceSheetQuery,
    ProfitAndLossQuery,
    AccountsQuery,
    InvoicesQuery,
    InvoicePdfQuery,
    CreditNotesQuery,
    CustomersQuery,
    SuppliersQuery,
    BillsQuery,
    CompanyQuery,
    PaymentsQuery,
    BankStatementsQuery,
    ItemsQuery,
    TaxRatesQuery } from '../src/codat-queries'

describe('Queries', () => {
  const COMPANY_ID = 'COMPANY_ID'
  const INVOICE_ID = 'INVOICE_ID'

  let QUERY_UNDER_TEST = null

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
                        COMPANY_ID,
                        PERIOD_LENGTH,
                        PERIODS_TO_COMPARE,
                        START_MONTH)
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
      [BankStatementsQuery, constants.BANK_STATEMENTS],
      [ItemsQuery, constants.ITEMS],
      [TaxRatesQuery, constants.TAX_RATES]
    ].forEach(queryTestParameters => {
      const queryName = queryTestParameters[0].name
      const QueryConstructor = queryTestParameters[0]
      const resourceRoute = queryTestParameters[1]

      describe(queryName, () => {
        beforeEach(() => {
          QUERY_UNDER_TEST = new QueryConstructor(
                        COMPANY_ID,
                        QUERY_STRING,
                        PAGE_NUMBER,
                        PAGE_SIZE)
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
              COMPANY_ID)
        })

        it(`should direct to ${queryName} resource`, () => {
          QUERY_UNDER_TEST.getResource().should.be.exactly(resourceRoute)
        })

        it(`should provide ${queryName} argument object`, () => {
          QUERY_UNDER_TEST.generateArgs().should.eql({ })
        })
      })
    })
  })

  describe('basic with id', () => {
    [
        [InvoicePdfQuery, `${constants.INVOICES}/${INVOICE_ID}/pdf`]
    ].forEach(queryTestParameters => {
      const queryName = queryTestParameters[0].name
      const QueryConstructor = queryTestParameters[0]
      const resourceRoute = queryTestParameters[1]

      describe(queryName, () => {
        beforeEach(() => {
          QUERY_UNDER_TEST = new QueryConstructor(
              COMPANY_ID,
              INVOICE_ID
            )
        })

        it(`should direct to ${queryName} resource`, () => {
          QUERY_UNDER_TEST.getResource().should.be.exactly(resourceRoute)
        })

        it(`should provide ${queryName} argument object`, () => {
          QUERY_UNDER_TEST.generateArgs().should.eql({ })
        })
      })
    })
  })
})
