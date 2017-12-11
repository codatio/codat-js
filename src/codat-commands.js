
class CodatCreateDataCommand {
  constructor (companyId) {
    if (!companyId) throw new Error(`company id not specified for ${this.getResource()}`)
    this.companyId = companyId
  }

  generateModel () { throw new Error('generateModel is abstract') }
  getResource () { throw new Error('getResource is abstract') }

  run (apiClient) {
    return apiClient.companyDataClient(this.companyId).post(this.getResource(), null, this.generateModel())
  }
}
exports.CodatCreateDataCommand = CodatCreateDataCommand

class CodatCreateCommand {
  generateModel () { throw new Error('generateModel is abstract') }
  getResource () { throw new Error('getResource is abstract') }

  run (apiClient) {
    return apiClient.__companyClient().post(this.getResource(), null, this.generateModel())
  }
}
exports.CodatCreateCommand = CodatCreateCommand

class CodatUpdateDataCommand {
  constructor (companyId, entityId) {
    if (!companyId) throw new Error(`company id not specified for ${this.getResource()}`)
    if (!entityId) throw new Error(`entity id not specified for ${this.getResource()}`)
    this.companyId = companyId
    this.entityId = entityId
  }

  generateModel () { throw new Error('generateModel is abstract') }
  getResource () { throw new Error('getResource is abstract') }

  run (apiClient) {
    return apiClient.companyDataClient(this.companyId).put(`${this.getResource()}/${this.entityId}`, null, this.generateModel())
  }
}
exports.CodatUpdateDataCommand = CodatUpdateDataCommand

class CodatUpdateCommand {
  constructor (entityId) {
    if (!entityId) throw new Error(`entity id not specified for ${this.getResource()}`)
    this.entityId = entityId
  }

  generateModel () { throw new Error('generateModel is abstract') }
  getResource () { throw new Error('getResource is abstract') }

  run (apiClient) {
    return apiClient.__companyClient().put(`${this.getResource()}/${this.entityId}`, null, this.generateModel())
  }
}
exports.CodatUpdateCommand = CodatUpdateCommand

class CodatDeleteDataCommand {
  constructor (companyId, entityId) {
    if (!companyId) throw new Error(`company id not specified for ${this.getResource()}`)
    if (!entityId) throw new Error(`entity id not specified for ${this.getResource()}`)
    this.companyId = companyId
    this.entityId = entityId
  }

  getResource () { throw new Error('getResource is abstract') }

  run (apiClient) {
    return apiClient.companyDataClient(this.companyId).delete(`${this.getResource()}/${this.entityId}`, null)
  }
}
exports.CodatDeleteDataCommand = CodatDeleteDataCommand

class CodatDeleteCommand {
  constructor (entityId) {
    if (!entityId) throw new Error(`entity id not specified for ${this.getResource()}`)
    this.entityId = entityId
  }

  getResource () { throw new Error('getResource is abstract') }

  run (apiClient) {
    return apiClient.__companyClient().delete(`${this.getResource()}/${this.entityId}`, null)
  }
}
exports.CodatDeleteCommand = CodatDeleteCommand
