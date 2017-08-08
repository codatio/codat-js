import { constants } from './codat'

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

export class BalanceSheetQuery extends FinancialQuery {
  getResource () {
    return constants.datasets.BALANCE_SHEET
  }
}

export class ProfitAndLossQuery extends FinancialQuery {
  getResource () {
    return constants.datasets.PROFIT_AND_LOSS
  }
}

export class FlexibleQuery extends CodatQuery {
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

export class AccountsQuery extends CodatQuery {
  generateArgs () {
    return { }
  }

  getResource () {
    return constants.datasets.CHART_OF_ACCOUNTS
  }
}

export class BillsQuery extends FlexibleQuery {
  getResource () {
    return constants.datasets.BILLS
  }
}

export class CreditNotesQuery extends FlexibleQuery {
  getResource () {
    return constants.datasets.CREDIT_NOTES
  }
}

export class InvoicesQuery extends FlexibleQuery {
  getResource () {
    return constants.datasets.INVOICES
  }
}

export class CustomersQuery extends FlexibleQuery {
  getResource () {
    return constants.datasets.CUSTOMERS
  }
}

export class SuppliersQuery extends FlexibleQuery {
  getResource () {
    return constants.datasets.SUPPLIERS
  }
}

export class PaymentsQuery extends FlexibleQuery {
  getResource () {
    return constants.datasets.PAYMENTS
  }
}

export class CompanyQuery extends FlexibleQuery {
  getResource () {
    return constants.datasets.COMPANY
  }
}

export class BankStatementsQuery extends FlexibleQuery {
  getResource () {
    return constants.datasets.BANK_STATEMENTS
  }
}
