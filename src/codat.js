const request = require('request-promise')
const btoa = require('btoa')

const constants = {
  COMPANIES: 'companies',
  UAT: 'uat',
  PRODUCTION: 'production',
  datasets: {
    BALANCE_SHEET: 'financials/balanceSheet',
    BILLS: 'bills',
    CHART_OF_ACCOUNTS: 'accounts',
    CREDIT_NOTES: 'creditNotes',
    CUSTOMERS: 'customers',
    INVOICES: 'invoices',
    PAYMENTS: 'payments',
    PROFIT_AND_LOSS: 'financials/profitAndLoss',
    SUPPLIERS: 'suppliers',
    BANK_STATEMENTS: 'bankStatements',
    COMPANY: 'info'
  },
  refresh: {
    ALL: 'all',
    QUEUE: 'queue'
  }
}
exports.constants = constants

class Api {
  constructor (baseUrl, apiKey) {
    this.__baseUrl = baseUrl
    this.__apiKey = apiKey
  }

  get (resource, args) {
    return request(this.__baseRequest(resource, args, 'GET'))
  }

  post (resource, args, body) {
    return request(this.__baseRequest(resource, args, 'POST', body))
  }

  put (resource, args, body) {
    return request(this.__baseRequest(resource, args, 'PUT', body))
  }

  delete (resource, args) {
    return request(this.__baseRequest(resource, args, 'DELETE'))
  }

  __baseRequest (resource, args, method, body) {
    return {
      baseUrl: this.__baseUrl,
      uri: resource,
      qs: args,
      json: true,
      headers: {
        Authorization: 'Basic ' + btoa(this.__apiKey)
      },
      method: method,
      body: body
    }
  }
}

class AddCompany {
  constructor (name, platformType) {
    this.name = name
    this.platformType = platformType
  }
}
exports.AddCompany = AddCompany

class UpdateCompanySettings {
  constructor (offlineConnectorInstall) {
    this.offlineConnectorInstall = offlineConnectorInstall
  }
}
exports.UpdateCompanySettings = UpdateCompanySettings

class CodatApiClient {
  constructor (baseUrl, apiKey) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey

    this.companiesApi = new Api(baseUrl, apiKey)
  }

  __companiesBaseUrl (companyId) {
    return `${constants.COMPANIES}/${companyId}`
  }

  getCompanies () {
    return this.companiesApi.get(constants.COMPANIES)
  }

  addCompany (companyName, platformType) {
    return this.companiesApi.post(
      constants.COMPANIES, null,
      companyName instanceof AddCompany ? companyName : new AddCompany(companyName, platformType))
  }

  getCompany (companyId) {
    return this.companiesApi.get(this.__companiesBaseUrl(companyId))
  }

  updateCompany (companyId, platformType) {
    return this.companiesApi.put(this.__companiesBaseUrl(companyId), null, platformType)
  }

  removeCompany (companyId) {
    return this.companiesApi.delete(this.__companiesBaseUrl(companyId))
  }

  getCompanySettings (companyId) {
    return this.companiesApi.get(this.__companiesBaseUrl(companyId) + '/settings')
  }

  updateCompanySettings (companyId, offlineConnectorInstall) {
    return this.companiesApi.put(
      this.__companiesBaseUrl(companyId) + '/settings', null,
      companyId instanceof UpdateCompanySettings ? companyId : new UpdateCompanySettings(offlineConnectorInstall))
  }

  getCompanyDataStatus (companyId) {
    return this.companiesApi.get(this.__companiesBaseUrl(companyId) + '/dataStatus')
  }

  companyDataClient (companyId) {
    return new Api(`${this.baseUrl}/${this.__companiesBaseUrl(companyId)}/data`, this.apiKey)
  }
}

exports.CodatApiClient = CodatApiClient

const uat = (apiKey) => new CodatApiClient('https://api-uat.codat.io', apiKey)
exports.uat = uat

const production = (apiKey) => new CodatApiClient('https://api.codat.io', apiKey)
exports.production = production

exports.apiClient = (environment) => {
  switch (environment) {
    case constants.UAT:
      return uat
    case constants.PRODUCTION:
      return production
  }
}
