const dataSetConstants = require('./codat-queries').constants

const constants = {
  ALL: 'all',
  QUEUE: 'queue'
}
exports.constants = constants

/// Sync company.

class CodatSync {
  constructor (companyId) {
    this.companyId = companyId
  }

  getResource () { throw new Error('getResource is abstract') }

  run (apiClient) {
    return apiClient.companyDataClient(this.companyId).post(this.getResource())
  }
}

class RefreshAllDatasets extends CodatSync {
  getResource () { return constants.ALL }
}
exports.RefreshAllDatasets = RefreshAllDatasets

class RefreshDataset extends CodatSync {
  constructor (companyId, datasetName) {
    super(companyId)
    // BUG: naming for api and datatype is different.
    this.datasetName = datasetName === dataSetConstants.COMPANY ? 'company' : datasetName
  }

  getResource () { return `${constants.QUEUE}/${this.datasetName}` }
}
exports.RefreshDataset = RefreshDataset
