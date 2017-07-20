var request = require('request-promise');
var btoa = require('btoa');

var api = function (baseUrl) {
    return function(apiKey) {
        var encodedKey = btoa(apiKey);

        var codatHeaders = {"Authorization": "Basic " + encodedKey};

        return {
            get: function (resource, args) {
                var req = this.baseRequest(resource, args);
                req.method = 'GET';

                return request(req);
            },

            post: function (resource, args, body) {
                var req = this.baseRequest(resource, args);
                req.method = 'POST';
                req.body = body;

                return request(req);
            },

            put: function (resource, args, body) {
                var req = this.baseRequest(resource, args);
                req.method = 'PUT';
                req.body = body;

                return request(req);
            },

            delete: function (resource, args) {
                var req = this.baseRequest(resource, args);
                req.method = 'DELETE';

                return request(req);
            },

            companyDataClient: function(companyId) {
                return api(baseUrl+'/companies/'+companyId+'/data')(apiKey);
            },

            baseRequest: function (resource, args) {
                return {
                    baseUrl: baseUrl,
                    uri: resource,
                    qs: args,
                    json: true,
                    headers: codatHeaders
                }
            }
        };
    };
};

exports.uat = api("https://api-uat.codat.io");
exports.production = api("https://api.codat.io");