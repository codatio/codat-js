const queries = require('./codat-queries')
const commands = require('./codat-commands')

const constants = {
  RULES: 'rules',
  RULE_WITHID: (ruleId) => `${constants.RULES}/${ruleId}`,
  ALERTS: 'rules/alerts',
  ALERT_WITHID: (alertId) => `${constants.RULES}/alerts/${alertId}`,
  ALERTS_FORRULE: (ruleId) => `${constants.RULE_WITHID(ruleId)}/alerts`,
  DEFAULT_GUID: '00000000-0000-0000-0000-000000000000'
}
exports.constants = constants

const COMPARISONS = {
  GT: '>',
  LT: '<'
}
exports.COMPARISONS = COMPARISONS

// RULE QUERIES

class BaseRulesQuery extends queries.CodatQuery {
  generateArgs () {
    return { }
  }
}

class RulesQuery extends BaseRulesQuery {
  getResource () {
    return constants.RULES
  }
}
exports.RulesQuery = RulesQuery

class RuleQuery extends BaseRulesQuery {
  constructor (ruleId) {
    super()
    this.ruleId = ruleId
  }

  getResource () {
    return constants.RULE_WITHID(this.ruleId)
  }
}
exports.RuleQuery = RuleQuery

class AlertsQuery extends BaseRulesQuery {
  getResource () {
    return constants.ALERTS
  }
}
exports.AlertsQuery = AlertsQuery

class AlertQuery extends BaseRulesQuery {
  constructor (alertId) {
    super()
    this.alertId = alertId
  }

  getResource () {
    return constants.ALERT_WITHID(this.alertId)
  }
}
exports.AlertQuery = AlertQuery

class AlertsForRuleQuery extends BaseRulesQuery {
  constructor (ruleId) {
    super()
    this.ruleId = ruleId
  }

  getResource () {
    return constants.ALERTS_FORRULE(this.ruleId)
  }
}
exports.AlertsForRuleQuery = AlertsForRuleQuery

// RULE COMMANDS

class CodatRuleOptions {
  constructor (companyId, emails, webhook) {
    this.companyId = companyId
    this.emails = emails
    this.webhook = webhook
  }

  static create () {
    return new CodatRuleOptions()
  }

  withCompany (companyId) {
    return new CodatRuleOptions(companyId, this.emails, this.webhook)
  }

  withEmail (email) {
    if (this.emails && this.emails.indexOf(email) > -1) {
      return this
    }

    const emails = this.emails || []
    emails.push(email)
    return new CodatRuleOptions(this.companyId, emails, this.webhook)
  }

  withWebHook (webhook) {
    return new CodatRuleOptions(this.companyId, this.emails, webhook)
  }
}
exports.CodatRuleOptions = CodatRuleOptions

class CodatRule {
  constructor (options) {
    if (options && !(options instanceof CodatRuleOptions)) {
      throw new Error('Options must be of type CodatRuleOptions')
    }

    if (options) {
      this.companyId = options.companyId || null
      this.emails = options.emails || null
      this.webhook = options.webhook || null
    }
  }

  toModel () { throw new Error('generateModel is abstract') }

  modelForType (type) {
    return {
      type: type,
      companyId: this.companyId,
      notifiers: {
        emails: this.emails,
        webhook: this.webhook
      }
    }
  }
}
exports.CodatRule = CodatRule

// Data sync completed
class DataSyncCompleteRule extends CodatRule {
  toModel () {
    return this.modelForType('Data sync completed')
  }
}
exports.DataSyncCompleteRule = DataSyncCompleteRule

class NewCompanySynchronised extends CodatRule {
  toModel () {
    return this.modelForType('New company synchronised')
  }
}
exports.NewCompanySynchronised = NewCompanySynchronised

class ComparisonRule extends CodatRule {
  constructor (options, comparison, ratioLimit) {
    super(options)

    this.comparison = comparison || '>'
    if (this.isValidComparison(this.comparison) === false) {
      throw new Error('Valid comparions are only < and >')
    }

    this.ratioLimit = ratioLimit || 0
  }

  isValidComparison (comparison) {
    return comparison === COMPARISONS.LT || comparison === COMPARISONS.GT
  }
}

class CurrentAssetsCurrentLiabilitiesRatioRule extends ComparisonRule {
  toModel () {
    return this.modelForType(`CurrentAssetsCurrentLiabilitiesRatio(${this.comparison},${this.ratioLimit})`)
  }
}
exports.CurrentAssetsCurrentLiabilitiesRatioRule = CurrentAssetsCurrentLiabilitiesRatioRule

class DebtorsOutstandingLoanOutstandingRatioRule extends ComparisonRule {
  toModel () {
    return this.modelForType(`DebtorsOutstandingLoanOutstandingRatio(${this.comparison},${this.ratioLimit})`)
  }
}
exports.DebtorsOutstandingLoanOutstandingRatioRule = DebtorsOutstandingLoanOutstandingRatioRule

class AddRuleCommand extends commands.CodatCreateCommand {
  constructor (type) {
    super()

    if (!(type instanceof CodatRule)) {
      throw new Error('Type must be of type CodatRule')
    }

    this.type = type
  }

  generateModel () {
    return this.type.toModel()
  }

  getResource () {
    return constants.RULES
  }
}
exports.AddRuleCommand = AddRuleCommand

class DeleteRuleCommand extends commands.CodatDeleteCommand {
  getResource () {
    return constants.RULES
  }
}
exports.DeleteRuleCommand = DeleteRuleCommand
