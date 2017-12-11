
class CodatCreateCommand {
  constructor (companyId) {
    this.companyId = companyId
  }

  generateModel () { throw new Error('generateModel is abstract') }
  getResource () { throw new Error('getResource is abstract') }

  run (apiClient) {
    return apiClient.companyDataClient(this.companyId).post(this.getResource(), null, this.generateModel())
  }
}
exports.CodatCreateCommand = CodatCreateCommand

class CodatUpdateCommand {
  constructor (companyId, entityId) {
    this.companyId = companyId
    this.entityId = entityId
  }

  generateModel () { throw new Error('generateModel is abstract') }
  getResource () { throw new Error('getResource is abstract') }

  run (apiClient) {
    return apiClient.companyDataClient(this.companyId).put(`${this.getResource()}/${this.entityId}`, null, this.generateModel())
  }
}
exports.CodatUpdateCommand = CodatUpdateCommand

class CodatDeleteCommand {
  constructor (companyId, entityId) {
    this.companyId = companyId
    this.entityId = entityId
  }

  getResource () { throw new Error('getResource is abstract') }

  run (apiClient) {
    return apiClient.companyDataClient(this.companyId).delete(`${this.getResource()}/${this.entityId}`, null)
  }
}
exports.CodatDeleteCommand = CodatDeleteCommand
