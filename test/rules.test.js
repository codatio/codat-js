import should from 'should'
import {
  constants,
  RulesQuery,
  RuleQuery,
  AlertsQuery,
  AlertQuery,
  AlertsForRuleQuery,
  AddRuleCommand,
  DataSyncCompleteRule,
  NewCompanySynchronised,
  CurrentAssetsCurrentLiabilitiesRatioRule,
  DebtorsOutstandingLoanOutstandingRatioRule,
  CodatRuleOptions
} from '../src/codat-rules'

describe('Rules', () => {
  let QUERY_OR_COMMAND_UNDER_TEST = null

  describe('queries', () => {
    const RULE_ID = constants.DEFAULT_GUID
    const ALERT_ID = constants.DEFAULT_GUID;

    [
      [RulesQuery, constants.RULES],
      [RuleQuery, constants.RULE_WITHID(RULE_ID)],
      [AlertsQuery, constants.ALERTS],
      [AlertQuery, constants.ALERT_WITHID(ALERT_ID)],
      [AlertsForRuleQuery, constants.ALERTS_FORRULE(RULE_ID)]
    ].forEach(queryTestParameters => {
      const queryName = queryTestParameters[0].name
      const QueryConstructor = queryTestParameters[0]
      const resourceRoute = queryTestParameters[1]

      describe(queryName, () => {
        beforeEach(() => {
          QUERY_OR_COMMAND_UNDER_TEST = new QueryConstructor(
            constants.DEFAULT_GUID
          )
        })

        it(`should direct to ${queryName} resource`, () => {
          QUERY_OR_COMMAND_UNDER_TEST.getResource().should.be.exactly(
            resourceRoute
          )
        })

        it(`should provide ${queryName} argument object`, () => {
          QUERY_OR_COMMAND_UNDER_TEST.generateArgs().should.eql({})
        })
      })
    })
  })

  describe('commands', () => {
    [
      [DataSyncCompleteRule, 'Data sync completed'],
      [NewCompanySynchronised, 'New company synchronised'],
      [CurrentAssetsCurrentLiabilitiesRatioRule, 'CurrentAssetsCurrentLiabilitiesRatio(>,0)'],
      [DebtorsOutstandingLoanOutstandingRatioRule, 'DebtorsOutstandingLoanOutstandingRatio(>,0)']
    ].forEach(queryTestParameters => {
      const ruleName = queryTestParameters[0].name
      const RuleConstructor = queryTestParameters[0]
      const type = queryTestParameters[1]

      describe(ruleName, () => {
        beforeEach(() => {
          QUERY_OR_COMMAND_UNDER_TEST = new AddRuleCommand(
            new RuleConstructor(CodatRuleOptions.create())
          )
        })

        it(`should direct to ${ruleName} resource`, () => {
          QUERY_OR_COMMAND_UNDER_TEST.getResource().should.be.exactly(constants.RULES)
        })

        it(`should create ${ruleName} correct type for model object of rule`, () => {
          QUERY_OR_COMMAND_UNDER_TEST.generateModel().should.eql({
            type: type,
            companyId: null,            
            notifiers: {
              emails: null,
              webhook: null
            }
          })
        })
      })
    })
  })

  describe('command options', () => {
    const COMPANY_ID = constants.DEFAULT_GUID
    const NOTIFY_EMAIL1 = 'hello@world.com'
    const NOTIFY_EMAIL2 = 'goodbye@world.com'
    const NOTIFY_WEBHOOK = 'https://web.hook.com/alert';

    [
      [
        'Empty',
        () => CodatRuleOptions.create(),
        {
          type: 'Data sync completed',
          companyId: null,          
          notifiers: {
            emails: null,
            webhook: null
          }
        }
      ],
      [
        'CompanyId',
        () => CodatRuleOptions.create().withCompany(COMPANY_ID),
        {
          type: 'Data sync completed',
          companyId: COMPANY_ID,
          notifiers: {
            emails: null,
            webhook: null
          }
        }
      ],
      [
        'Email',
        () => CodatRuleOptions.create().withEmail(NOTIFY_EMAIL1).withEmail(NOTIFY_EMAIL1).withEmail(NOTIFY_EMAIL2),
        {
          type: 'Data sync completed',
          companyId: null,
          notifiers: {
            emails: [NOTIFY_EMAIL1, NOTIFY_EMAIL2],
            webhook: null
          }
        }
      ],
      [
        'Webhook',
        () => CodatRuleOptions.create().withWebHook(NOTIFY_WEBHOOK),
        {
          type: 'Data sync completed',
          companyId: null,          
          notifiers: {
            emails: null,
            webhook: NOTIFY_WEBHOOK
          }
        }
      ]
    ].forEach(queryTestParameters => {
      const ruleName = queryTestParameters[0]
      const OptionsBuilder = queryTestParameters[1]
      const EXPECTED_OPTIONS = queryTestParameters[2]

      describe(ruleName, () => {
        beforeEach(() => {
          QUERY_OR_COMMAND_UNDER_TEST = new AddRuleCommand(
            new DataSyncCompleteRule(OptionsBuilder())
          )
        })

        it(`should create ${ruleName} options for model object of rule`, () => {
          QUERY_OR_COMMAND_UNDER_TEST.generateModel().should.eql(
            EXPECTED_OPTIONS
          )
        })
      })
    })
  })
})
