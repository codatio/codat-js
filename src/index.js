import * as queries from 'codat-queries'
import * as refresh from 'codat-refresh'
import * as rules from 'codat-rules'

import {
    uat,
    production,
    apiClient,
    CodatApiClient,
    UpdateCompanySettings,
    AddCompany } from 'codat'

exports.uat = uat
exports.production = production
exports.apiClient = apiClient
exports.CodatApiClient = CodatApiClient

exports.UpdateCompanySettings = UpdateCompanySettings
exports.AddCompany = AddCompany

exports.queries = queries
exports.refresh = refresh
exports.rules = rules
