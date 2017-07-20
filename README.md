# Codat.js

Node.js module for accessing the Codat Accounting Data API

For more information on Codat see [www.codat.io](https://www.codat.io)

### Usage Example

```javascript
var codat = require("codat");

var apiKey = '<YOUR API KEY HERE>';
// Use codat.uat for UAT environment
// Use codat.production for Production environment

var codatApi = codat.uat(apiKey);
// Fetch list of all linked companies
codatApi.get('companies')
    .then(response => response.companies.forEach(r => console.log(r.name)))
    .then(() => {
        // Fetch data for single linked company
        var companyId = 'ff36ff03-17de-47be-883a-5ceecbbc65ed';

        var companyClient = codatApi.companyDataClient(companyId);
        // Fetch monthly balance sheet for last 3 months
        return companyClient.get('financials/balanceSheet', {
            periodLength: 1,
            periodsToCompare: 3
        })
    })
    .then(response => {
        // Display net assets for each period
        response.reports.forEach(r => console.log(r.date + ' - Net Assets: '+ response.currency + ' ' + r.netAssets));
    });
```