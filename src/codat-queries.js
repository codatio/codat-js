
const constants = {
  BALANCE_SHEET: 'financials/balanceSheet',
  BILLS: 'bills',
  BILL_PAYMENTS: 'billPayments',
  CHART_OF_ACCOUNTS: 'accounts',
  CREDIT_NOTES: 'creditNotes',
  CUSTOMERS: 'customers',
  INVOICES: 'invoices',
  PAYMENTS: 'payments',
  PROFIT_AND_LOSS: 'financials/profitAndLoss',
  SUPPLIERS: 'suppliers',
  BANK_STATEMENTS: 'bankStatements',
  COMPANY: 'info',
  ITEMS: 'items',
  TAX_RATES: 'taxRates'
}
exports.constants = constants

// Query company
class CodatQuery {
  generateArgs () { throw new Error('generateArgs is abstract') }
  getResource () { throw new Error('getResource is abstract') }

  run (apiClient) {
    return apiClient.__companyClient().get(this.getResource(), this.generateArgs())
  }
}
exports.CodatQuery = CodatQuery

class CodatDataQuery extends CodatQuery {
  constructor (companyId) {
    super()
    this.companyId = companyId
  }

  generateArgs () { throw new Error('generateArgs is abstract') }
  getResource () { throw new Error('getResource is abstract') }

  run (apiClient) {
    return apiClient.companyDataClient(this.companyId).get(this.getResource(), this.generateArgs())
  }
}

class FinancialQuery extends CodatDataQuery {
  constructor (companyId, periodLength, periodsToCompare, startMonth) {
    super(companyId)
    this.periodLength = periodLength
    this.periodsToCompare = periodsToCompare
    this.startMonth = startMonth
  }

  generateArgs () {
    return {
      periodLength: this.periodLength,
      periodsToCompare: this.periodsToCompare,
      startMonth: this.startMonth
    }
  }
}

class BalanceSheetQuery extends FinancialQuery {
  getResource () {
    return constants.BALANCE_SHEET
  }
}
exports.BalanceSheetQuery = BalanceSheetQuery

class ProfitAndLossQuery extends FinancialQuery {
  getResource () {
    return constants.PROFIT_AND_LOSS
  }
}
exports.ProfitAndLossQuery = ProfitAndLossQuery

class FlexibleQuery extends CodatDataQuery {
  constructor (companyId, queryString) {
    super(companyId)
    this.queryString = queryString
  }

  generateArgs () {
    return {
      query: this.queryString
    }
  }
}

class FlexiblePagedQuery extends FlexibleQuery {
  constructor (companyId, queryString, pageNumber, pageSize) {
    super(companyId, queryString)
    this.pageNumber = pageNumber
    this.pageSize = pageSize
  }

  generateArgs () {
    return {
      query: this.queryString,
      page: this.pageNumber,
      pageSize: this.pageSize
    }
  }
}

class AccountsQuery extends CodatDataQuery {
  generateArgs () {
    return { }
  }

  getResource () {
    return constants.CHART_OF_ACCOUNTS
  }
}
exports.AccountsQuery = AccountsQuery

class BillsQuery extends FlexiblePagedQuery {
  getResource () {
    return constants.BILLS
  }
}
exports.BillsQuery = BillsQuery

class CreditNotesQuery extends FlexiblePagedQuery {
  getResource () {
    return constants.CREDIT_NOTES
  }
}
exports.CreditNotesQuery = CreditNotesQuery

class InvoicesQuery extends FlexiblePagedQuery {
  getResource () {
    return constants.INVOICES
  }
}
exports.InvoicesQuery = InvoicesQuery

class InvoicePdfQuery extends CodatDataQuery {
  constructor (companyId, invoiceId) {
    super(companyId)
    this.invoiceId = invoiceId
  }

  getResource () {
    return `${constants.INVOICES}/${this.invoiceId}/pdf`
  }

  generateArgs () {
    return { }
  }
}
exports.InvoicePdfQuery = InvoicePdfQuery

class CustomersQuery extends FlexiblePagedQuery {
  getResource () {
    return constants.CUSTOMERS
  }
}
exports.CustomersQuery = CustomersQuery

class SuppliersQuery extends FlexiblePagedQuery {
  getResource () {
    return constants.SUPPLIERS
  }
}
exports.SuppliersQuery = SuppliersQuery

class PaymentsQuery extends FlexiblePagedQuery {
  getResource () {
    return constants.PAYMENTS
  }
}
exports.PaymentsQuery = PaymentsQuery

class ItemsQuery extends FlexiblePagedQuery {
  getResource () {
    return constants.ITEMS
  }
}
exports.ItemsQuery = ItemsQuery

class TaxRatesQuery extends FlexiblePagedQuery {
  getResource () {
    return constants.TAX_RATES
  }
}
exports.TaxRatesQuery = TaxRatesQuery

class CompanyQuery extends CodatDataQuery {
  getResource () {
    return constants.COMPANY
  }

  generateArgs () {
    return { }
  }
}
exports.CompanyQuery = CompanyQuery

class BankStatementsQuery extends FlexiblePagedQuery {
  getResource () {
    return constants.BANK_STATEMENTS
  }
}
exports.BankStatementsQuery = BankStatementsQuery
