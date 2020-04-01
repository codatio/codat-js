
const constants = {
  BALANCE_SHEET: 'financials/balanceSheet',
  BANK_ACCOUNTS: 'bankAccounts',
  BANK_STATEMENTS: 'bankStatements',
  BANK_TRANSACTIONS: 'bankTransactions',
  BILLS: 'bills',
  BILL_PAYMENTS: 'billPayments',
  CHART_OF_ACCOUNTS: 'accounts',
  COMPANY: 'info',
  CREDIT_NOTES: 'creditNotes',
  CUSTOMERS: 'customers',
  INVOICES: 'invoices',
  ITEMS: 'items',
  PAYMENTS: 'payments',
  PROFIT_AND_LOSS: 'financials/profitAndLoss',
  SUPPLIERS: 'suppliers',
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

class CodatDataQueryWithDataConnection extends CodatQuery {
  constructor (companyId, dataConnectionId) {
    super()
    this.companyId = companyId
    this.dataConnectionId = dataConnectionId
  }

  generateArgs () { throw new Error('generateArgs is abstract') }
  getResource () { throw new Error('getResource is abstract') }

  run (apiClient) {
    return apiClient.dataConnectionDataClient(this.companyId, this.dataConnectionId).get(this.getResource(), this.generateArgs())
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

class FlexibleQueryWithDataConnection extends CodatDataQueryWithDataConnection {
  constructor (companyId, dataConnectionId, queryString) {
    super(companyId, dataConnectionId)
    this.queryString = queryString
  }

  generateArgs () {
    return {
      query: this.queryString
    }
  }
}

class CodatDataQueryWithDataConnectionAndRecordId extends CodatDataQueryWithDataConnection {
  constructor (companyId, dataConnectionId, recordId) {
    super(companyId, dataConnectionId)
    this.recordId = recordId
  }
  generateArgs () {
    return {}
  }
}

class AttachmentsQuery extends CodatDataQueryWithDataConnectionAndRecordId {
  constructor (companyId, dataConnectionId, dataType, recordId) {
    super(companyId, dataConnectionId, recordId)
    if (Object.keys(constants).includes(dataType) === false) {
      throw new Error(`Data type ${dataType} is not valid.`)
    }
    this.dataType = dataType
    this.dataTypePath = constants[dataType]
  }
}

class ListAttachmentsMetadataQuery extends AttachmentsQuery {
  getResource () {
    return `${this.dataTypePath}/${this.recordId}/attachments`
  }
}

class SpecificAttachmentQuery extends AttachmentsQuery {
  constructor (companyId, dataConnectionId, dataType, recordId, attachmentId) {
    super(companyId, dataConnectionId, dataType, recordId)
    this.attachmentId = attachmentId
  }
}

class ListSpecificAttachmentMetadataQuery extends SpecificAttachmentQuery {
  getResource () {
    return `${this.dataTypePath}/${this.recordId}/attachments/${this.attachmentId}`
  }
}

class DownloadAttachmentQuery extends SpecificAttachmentQuery {
  getResource () {
    return `${this.dataTypePath}/${this.recordId}/attachments/${this.attachmentId}/download`
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

class FlexiblePagedQueryWithDataConnection extends FlexibleQueryWithDataConnection {
  constructor (companyId, dataConnectionId, queryString, pageNumber, pageSize) {
    super(companyId, dataConnectionId, queryString)
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

class FlexiblePagedQueryWithDataConnectionAndRecordId extends FlexiblePagedQueryWithDataConnection {
  constructor (companyId, dataConnectionId, recordId, queryString, pageNumber, pageSize) {
    super(companyId, dataConnectionId, queryString)
    this.pageNumber = pageNumber
    this.pageSize = pageSize
    this.recordId = recordId
  }
}

class AccountsQuery extends CodatDataQuery {
  generateArgs () {
    return {}
  }

  getResource () {
    return constants.CHART_OF_ACCOUNTS
  }
}
exports.AccountsQuery = AccountsQuery

class BankAccountsQuery extends FlexiblePagedQueryWithDataConnection {
  getResource () {
    return constants.BANK_ACCOUNTS
  }
}
exports.BankAccountsQuery = BankAccountsQuery

class BankAccountTransactionsQuery extends FlexiblePagedQueryWithDataConnectionAndRecordId {
  getResource () {
    return `${constants.BANK_ACCOUNTS}/${this.recordId}/${constants.BANK_TRANSACTIONS}`
  }
}
exports.BankAccountTransactionsQuery = BankAccountTransactionsQuery

class BillsQuery extends FlexiblePagedQuery {
  getResource () {
    return constants.BILLS
  }
}
exports.BillsQuery = BillsQuery

class BillAttachmentsQuery extends ListAttachmentsMetadataQuery {
  constructor (companyId, dataConnectionId, BillId) {
    super(companyId, dataConnectionId, 'BILLS', BillId)
  }
}
exports.BillAttachmentsQuery = BillAttachmentsQuery

class BillDownloadAttachmentQuery extends DownloadAttachmentQuery {
  constructor (companyId, dataConnectionId, BillId, attachmentId) {
    super(companyId, dataConnectionId, 'BILLS', BillId, attachmentId)
  }
}
exports.BillDownloadAttachmentQuery = BillDownloadAttachmentQuery

class BillSpecificAttachmentQuery extends ListSpecificAttachmentMetadataQuery {
  constructor (companyId, dataConnectionId, BillId, attachmentId) {
    super(companyId, dataConnectionId, 'BILLS', BillId, attachmentId)
  }
}
exports.BillSpecificAttachmentQuery = BillSpecificAttachmentQuery

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

class InvoiceAttachmentsQuery extends ListAttachmentsMetadataQuery {
  constructor (companyId, dataConnectionId, invoiceId) {
    super(companyId, dataConnectionId, 'INVOICES', invoiceId)
  }
}
exports.InvoiceAttachmentsQuery = InvoiceAttachmentsQuery

class InvoiceDownloadAttachmentQuery extends DownloadAttachmentQuery {
  constructor (companyId, dataConnectionId, invoiceId, attachmentId) {
    super(companyId, dataConnectionId, 'INVOICES', invoiceId, attachmentId)
  }
}
exports.InvoiceDownloadAttachmentQuery = InvoiceDownloadAttachmentQuery

class InvoiceSpecificAttachmentQuery extends ListSpecificAttachmentMetadataQuery {
  constructor (companyId, dataConnectionId, invoiceId, attachmentId) {
    super(companyId, dataConnectionId, 'INVOICES', invoiceId, attachmentId)
  }
}
exports.InvoiceSpecificAttachmentQuery = InvoiceSpecificAttachmentQuery

class InvoicePdfQuery extends CodatDataQuery {
  constructor (companyId, invoiceId) {
    super(companyId)
    this.invoiceId = invoiceId
  }

  getResource () {
    return `${constants.INVOICES}/${this.invoiceId}/pdf`
  }

  generateArgs () {
    return {}
  }
}
exports.InvoicePdfQuery = InvoicePdfQuery

class CustomersQuery extends FlexiblePagedQuery {
  getResource () {
    return constants.CUSTOMERS
  }
}
exports.CustomersQuery = CustomersQuery

class CustomerAttachmentsQuery extends ListAttachmentsMetadataQuery {
  constructor (companyId, dataConnectionId, CustomerId) {
    super(companyId, dataConnectionId, 'CUSTOMERS', CustomerId)
  }
}
exports.CustomerAttachmentsQuery = CustomerAttachmentsQuery

class CustomerDownloadAttachmentQuery extends DownloadAttachmentQuery {
  constructor (companyId, dataConnectionId, CustomerId, attachmentId) {
    super(companyId, dataConnectionId, 'CUSTOMERS', CustomerId, attachmentId)
  }
}
exports.CustomerDownloadAttachmentQuery = CustomerDownloadAttachmentQuery

class CustomerSpecificAttachmentQuery extends ListSpecificAttachmentMetadataQuery {
  constructor (companyId, dataConnectionId, CustomerId, attachmentId) {
    super(companyId, dataConnectionId, 'CUSTOMERS', CustomerId, attachmentId)
  }
}
exports.CustomerSpecificAttachmentQuery = CustomerSpecificAttachmentQuery

class SuppliersQuery extends FlexiblePagedQuery {
  getResource () {
    return constants.SUPPLIERS
  }
}
exports.SuppliersQuery = SuppliersQuery

class SupplierAttachmentsQuery extends ListAttachmentsMetadataQuery {
  constructor (companyId, dataConnectionId, SupplierId) {
    super(companyId, dataConnectionId, 'SUPPLIERS', SupplierId)
  }
}
exports.SupplierAttachmentsQuery = SupplierAttachmentsQuery

class SupplierDownloadAttachmentQuery extends DownloadAttachmentQuery {
  constructor (companyId, dataConnectionId, SupplierId, attachmentId) {
    super(companyId, dataConnectionId, 'SUPPLIERS', SupplierId, attachmentId)
  }
}
exports.SupplierDownloadAttachmentQuery = SupplierDownloadAttachmentQuery

class SupplierSpecificAttachmentQuery extends ListSpecificAttachmentMetadataQuery {
  constructor (companyId, dataConnectionId, SupplierId, attachmentId) {
    super(companyId, dataConnectionId, 'SUPPLIERS', SupplierId, attachmentId)
  }
}
exports.SupplierSpecificAttachmentQuery = SupplierSpecificAttachmentQuery

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
    return {}
  }
}
exports.CompanyQuery = CompanyQuery

class BankStatementsQuery extends FlexiblePagedQuery {
  getResource () {
    return constants.BANK_STATEMENTS
  }
}
exports.BankStatementsQuery = BankStatementsQuery
