import * as queries from 'codat-queries'
import * as refresh from 'codat-refresh'

import {
    uat,
    production,
    apiClient,
    CodatApiClient,
    UpdateCompanySettings,
    AddCompany,
    constants } from 'codat'

exports.constants = constants

exports.uat = uat
exports.production = production
exports.apiClient = apiClient
exports.CodatApiClient = CodatApiClient

exports.UpdateCompanySettings = UpdateCompanySettings
exports.AddCompany = AddCompany

exports.queries = queries
exports.refresh = refresh
