const constants = require('./codat').constants

// Query company
class CodatQuery {
  constructor (companyId) {
    this.companyId = companyId
  }

  generateArgs () { throw new Error('generateArgs is abstract') }
  getResource () { throw new Error('getResource is abstract') }

  run (apiClient) {
    return apiClient.companyDataClient(this.companyId).get(this.getResource(), this.generateArgs())
  }
}

class FinancialQuery extends CodatQuery {
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
    return constants.datasets.BALANCE_SHEET
  }
}
exports.BalanceSheetQuery = BalanceSheetQuery

class ProfitAndLossQuery extends FinancialQuery {
  getResource () {
    return constants.datasets.PROFIT_AND_LOSS
  }
}
exports.ProfitAndLossQuery = ProfitAndLossQuery

class FlexibleQuery extends CodatQuery {
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

class AccountsQuery extends CodatQuery {
  generateArgs () {
    return { }
  }

  getResource () {
    return constants.datasets.CHART_OF_ACCOUNTS
  }
}
exports.AccountsQuery = AccountsQuery

class BillsQuery extends FlexiblePagedQuery {
  getResource () {
    return constants.datasets.BILLS
  }
}
exports.BillsQuery = BillsQuery

class CreditNotesQuery extends FlexiblePagedQuery {
  getResource () {
    return constants.datasets.CREDIT_NOTES
  }
}
exports.CreditNotesQuery = CreditNotesQuery

class InvoicesQuery extends FlexiblePagedQuery {
  getResource () {
    return constants.datasets.INVOICES
  }
}
exports.InvoicesQuery = InvoicesQuery

class InvoicePdfQuery extends CodatQuery {
  constructor (companyId, invoiceId) {
    super(companyId)
    this.invoiceId = invoiceId
  }

  getResource () {
    return `${constants.datasets.INVOICES}/${this.invoiceId}/pdf`
  }

  generateArgs () {
    return {}
  }
}
exports.InvoicePdfQuery = InvoicePdfQuery

class CustomersQuery extends FlexiblePagedQuery {
  getResource () {
    return constants.datasets.CUSTOMERS
  }
}
exports.CustomersQuery = CustomersQuery

class SuppliersQuery extends FlexiblePagedQuery {
  getResource () {
    return constants.datasets.SUPPLIERS
  }
}
exports.SuppliersQuery = SuppliersQuery

class PaymentsQuery extends FlexiblePagedQuery {
  getResource () {
    return constants.datasets.PAYMENTS
  }
}
exports.PaymentsQuery = PaymentsQuery

class CompanyQuery extends CodatQuery {
  getResource () {
    return constants.datasets.COMPANY
  }

  generateArgs () {
    return { }
  }
}
exports.CompanyQuery = CompanyQuery

class BankStatementsQuery extends FlexiblePagedQuery {
  getResource () {
    return constants.datasets.BANK_STATEMENTS
  }
}
exports.BankStatementsQuery = BankStatementsQuery
