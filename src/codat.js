const request = require('request-promise')
const btoa = require('btoa')

const constants = {
  COMPANIES: 'companies',
  UAT: 'uat',
  PRODUCTION: 'production'
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
        Authorization: `Basic ${btoa(this.__apiKey)}`,
        'User-Agent': 'Codat-node-client/2.6.0'
      },
      method: method,
      body: body,
      encoding: null
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

    this.clientsApi = new Api(baseUrl, apiKey)
  }

  __companiesBaseUrl (companyId) {
    return `${constants.COMPANIES}/${companyId}`
  }

  __companyClient () {
    return this.clientsApi
  }

  getCompanies () {
    return this.clientsApi.get(constants.COMPANIES)
  }

  addCompany (companyName, platformType) {
    return this.clientsApi.post(
      constants.COMPANIES, null,
      companyName instanceof AddCompany ? companyName : new AddCompany(companyName, platformType))
  }

  getCompany (companyId) {
    return this.clientsApi.get(this.__companiesBaseUrl(companyId))
  }

  updateCompany (companyId, platformType) {
    return this.clientsApi.put(this.__companiesBaseUrl(companyId), null, platformType)
  }

  removeCompany (companyId) {
    return this.clientsApi.delete(this.__companiesBaseUrl(companyId))
  }

  getCompanySettings (companyId) {
    return this.clientsApi.get(`${this.__companiesBaseUrl(companyId)}/settings`)
  }

  updateCompanySettings (companyId, offlineConnectorInstall) {
    return this.clientsApi.put(
      `${this.__companiesBaseUrl(companyId)}/settings`, null,
      companyId instanceof UpdateCompanySettings ? companyId : new UpdateCompanySettings(offlineConnectorInstall))
  }

  getCompanyDataStatus (companyId) {
    return this.clientsApi.get(`${this.__companiesBaseUrl(companyId)}/dataStatus`)
  }

  companyDataClient (companyId) {
    return new Api(`${this.baseUrl}/${this.__companiesBaseUrl(companyId)}/data`, this.apiKey)
  }

  dataConnectionDataClient (companyId, dataConnectionId) {
    return new Api(`${this.baseUrl}/${this.__companiesBaseUrl(companyId)}/connections/${dataConnectionId}/data`, this.apiKey)
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
