[![npm version](https://badge.fury.io/js/codat.svg)](https://badge.fury.io/js/codat) [![Travis Build Status](https://travis-ci.org/codatio/codat-js.svg?branch=master)](https://travis-ci.org/codatio/codat-js) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# codat.js

[1. Installation](#1)<br/>
[2. Usage](#2)<br/>
[2.1 Building an API client](#21)<br/>
[2.2 Interacting with companies](#22)<br/>
[2.3 Using company data query objects](#23)<br/>
[2.4 Using the company data client](#24)

## <a name="1"></a> 1. Installation

Node module for accessing the Codat Accounting Data API from your node applications.

You can install this package using the following command:

`npm install --save codat`

For more information on Codat see [www.codat.io](https://www.codat.io)

## <a name="2"></a> 2. Usage

The codat library is written in idiomatic ES6 this is to support the use of modern features and tooling to make your life as a developer easier. 
If you are running your application on a platfrom that does not support this version of Javascript, you will need to use additional tools to compile 
the source code.

We use a tool called [Babel](https://babeljs.io/) at Codat and can highly recommend it.

Please refer to the tests in the project, they document the usage of the components found in the library.

### <a name="21"></a> 2.1 API client

The API client is a handy object that exposes useful functionality from the Codat public API, as well as helping you make queries against data for linked companies.

```javascript
// Import the module just like any other node dependancy.
import { 
    apiClient as codat, 
    queries as codatQueries } from 'codat';

var apiKey = '<YOUR API KEY HERE>';

// Use codat.uat for UAT environment.
var codatApiUat = codat.uat(apiKey);

var codatApi = codat.apiClient(codat.constants.UAT)(apiKey);

// Use whichever method suits your build pipeline the best.
codatApiUat === codatApi;

// Use codat.production for Production environment.
var codatApiProd = codat.production(apiKey);

var codatApi = codat.apiClient(codat.constants.PRODUCTION)(apiKey);

// The common datasets are listed in constant data.
var datasets = codatQueries.constants;
```

### <a name="22"></a> 2.2 Interacting with companies

When you want to intereact directly with your linked companies you can use the helper method exposed by the API client.

This set of features allows you to:

1. `addCompany` - Add companies.
2. `removeCompany` - Remove companies.
2. `updateCompany` - Update companies.
3. `getCompany` - Get information about a specific company.
4. `getCompanies` - Query for all currently linked companies.

```javascript
 // Please see section 2.1 on creating the codatApiClient 
// Add a new company
codatApi
    .addCompany(new AddCompany('My Company', 'xero'))
    .then(newCompany => console.log(newCompany.id));

// Fetch list of all linked companies
codatApi
    .getCompanies()
    .then(response => response.companies.forEach(r => console.log(r.name)));
```

### <a name="23"></a> 2.3 Using company data query objects

When you want to get hold of data for a specific company you can use one of the given query objects. 
These query objects make building reuseable queries much easier as they specify the specific parameters for filters that you might want to use.

```javascript
 // Please see section 2.1 on creating the codatApiClient
import { BalanceSheetQuery } from 'codat-queries';

var companyId = 'ff36ff03-17de-47be-883a-5ceecbbc65ed';

// Build a reusable query object. 
// The query objects help you specify any query parameters.
var balanceSheetQuery = new BalanceSheetQuery(companyId, 1, 3, new Date());

// Run the query using your codatApi client.
balanceSheetQuery
    .run(codatApi)
    .then(response => {
        // Display net assets for each period
        response.reports.forEach(r => console.log(`${r.date} - Net Assets: ${response.currency} ${r.netAssets}`));
    });
```

### <a name="24"></a> 2.4 Using the company data client

You can use the company data api client to build your own queries without the query objects and specifiy the arguments yourself. 

In fact this is what the query objects use under the hood! 

```javascript
 // Please see section 2.1 on creating the codatApiClient
var companyId = 'ff36ff03-17de-47be-883a-5ceecbbc65ed';

// You can also roll your own queries to the data api.
// Be aware some query parameters are not availble on all endpoints.
var companyClient = codatApi.companyDataClient(companyId);

// You can do this with a new company data client from the api client
companyClient.get(datasets.BALANCE_SHEET, {
    periodLength: 1,
    periodsToCompare: 3
})
.then(response => {
    // Display net assets for each period
    response.reports.forEach(r => console.log(`${r.date} - Net Assets: ${response.currency} ${r.netAssets}`));
});
```

### <a name="25"></a> 2.5 Refreshing data

If you need to refresh the data for a given company on demand, you cann use the provided refresh extensions and run them using the `codatApiClient` just like you can with the queries.


```javascript
 // Please see section 2.1 on creating the codatApiClient
import { RefreshAllDatasets } from 'codat-refresh';

var companyId = 'ff36ff03-17de-47be-883a-5ceecbbc65ed';

// Build a reusable refresh object.
var refreshAllDatasets = new RefreshAllDatasets(companyId);

// Run the query using your codatApi client.
refreshAllDatasets
    .run(codatApi)
    .then(response => {
        // You can now long pool the status endpoint for success.
        return codatApi.getCompanyDataStatus(companyId);    
    })
    .then(statuses => {
        // The statuses object is a dictionary of datasets to their 
        // refresh status.
        if (statuses[constants.datasets.INVOICES] === 'Complete') {
            // Invoices successfully refreshed!
        }
    });
```
