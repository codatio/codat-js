const constants = require('./codat').constants

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
  getResource () { return constants.refresh.ALL }
}
exports.RefreshAllDatasets = RefreshAllDatasets

class RefreshDataset extends CodatSync {
  constructor (companyId, datasetName) {
    super(companyId)
    this.datasetName = datasetName
  }

  getResource () { return `${constants.refresh.QUEUE}/${this.datasetName}` }
}
exports.RefreshDataset = RefreshDataset
