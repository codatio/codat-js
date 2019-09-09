import should from 'should'
import { uat, apiClient } from '../src/codat'
import {
  constants,
  BalanceSheetQuery,
  ProfitAndLossQuery,
  AccountsQuery,
  BankAccountsQuery,
  BankAccountTransactionsQuery,
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
  TaxRatesQuery
} from '../src/codat-queries'

const FAKE_API = () => {
  return {
    companyDataClientCalled: false,
    companyDataClient(companyId) {
      this.companyDataClientCalled = true;
      return {
        get: resource => true
      }
    },
    dataConnectionDataClientCalled: false,
    dataConnectionDataClient(companyId, dataConnectionId) {
      this.dataConnectionDataClientCalled = true;
      return {
        get: resource => true
      }
    }
  }
}

describe('Queries', () => {
  const COMPANY_ID = 'COMPANY_ID'
  const INVOICE_ID = 'INVOICE_ID'
  const TEST_DATACONNECTION_ID = 'dadadada-0000-4000-0000-0000000c0da7'

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
            COMPANY_ID,
            PERIOD_LENGTH,
            PERIODS_TO_COMPARE,
            START_MONTH);
          FAKE_API_CLIENT = new FAKE_API();

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
          QUERY_UNDER_TEST.run(FAKE_API_CLIENT);
          FAKE_API_CLIENT.companyDataClientCalled.should.eql(true);
          FAKE_API_CLIENT.dataConnectionDataClientCalled.should.eql(false);
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
            PAGE_SIZE);
          FAKE_API_CLIENT = new FAKE_API();
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
          QUERY_UNDER_TEST.run(FAKE_API_CLIENT);
          FAKE_API_CLIENT.companyDataClientCalled.should.eql(true);
          FAKE_API_CLIENT.dataConnectionDataClientCalled.should.eql(false);
        })
      })
    })
  })

  describe('flexible with data connection', () => {
    const QUERY_STRING = "Property1<100,Property2>100,Property3='value'";
    const PAGE_SIZE = 1000;
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
            COMPANY_ID,
            TEST_DATACONNECTION_ID,
            QUERY_STRING,
            PAGE_NUMBER,
            PAGE_SIZE);
          FAKE_API_CLIENT = new FAKE_API();
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
          QUERY_UNDER_TEST.run(FAKE_API_CLIENT);
          FAKE_API_CLIENT.dataConnectionDataClientCalled.should.eql(true);
          FAKE_API_CLIENT.companyDataClientCalled.should.eql(false);
        })
      })
    })
  })

  describe('flexible with data connection and item ID', () => {
    const QUERY_STRING = "Property1<100,Property2>100,Property3='value'";
    const PAGE_SIZE = 1000;
    const PAGE_NUMBER = 1;
    const ITEM_ID = '1123';

    [
      [BankAccountTransactionsQuery, `${constants.BANK_ACCOUNTS}/${ITEM_ID}/${constants.BANK_TRANSACTIONS}`]
    ].forEach(queryTestParameters => {
      const queryName = queryTestParameters[0].name
      const QueryConstructor = queryTestParameters[0]
      const resourceRoute = queryTestParameters[1]

      describe(queryName, () => {
        beforeEach(() => {
          QUERY_UNDER_TEST = new QueryConstructor(
            COMPANY_ID,
            TEST_DATACONNECTION_ID,
            ITEM_ID,
            QUERY_STRING,
            PAGE_NUMBER,
            PAGE_SIZE);
          FAKE_API_CLIENT = new FAKE_API();
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
          QUERY_UNDER_TEST.run(FAKE_API_CLIENT);
          FAKE_API_CLIENT.dataConnectionDataClientCalled.should.eql(true);
          FAKE_API_CLIENT.companyDataClientCalled.should.eql(false);
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
            COMPANY_ID);
          FAKE_API_CLIENT = new FAKE_API();
        })

        it(`should direct to ${queryName} resource`, () => {
          QUERY_UNDER_TEST.getResource().should.be.exactly(resourceRoute)
        })

        it(`should provide ${queryName} argument object`, () => {
          QUERY_UNDER_TEST.generateArgs().should.eql({})
        })

        it('should use the company data client to run', () => {
          QUERY_UNDER_TEST.run(FAKE_API_CLIENT);
          FAKE_API_CLIENT.companyDataClientCalled.should.eql(true);
          FAKE_API_CLIENT.dataConnectionDataClientCalled.should.eql(false);
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
          );
          FAKE_API_CLIENT = new FAKE_API();
        })

        it(`should direct to ${queryName} resource`, () => {
          QUERY_UNDER_TEST.getResource().should.be.exactly(resourceRoute)
        })

        it(`should provide ${queryName} argument object`, () => {
          QUERY_UNDER_TEST.generateArgs().should.eql({})
        })

        it('should use the company data client to run', () => {
          QUERY_UNDER_TEST.run(FAKE_API_CLIENT);
          FAKE_API_CLIENT.companyDataClientCalled.should.eql(true);
          FAKE_API_CLIENT.dataConnectionDataClientCalled.should.eql(false);
        })
      })
    })
  })
})
