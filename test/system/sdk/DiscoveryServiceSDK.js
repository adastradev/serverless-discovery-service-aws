// Example for IAM-authenticated API Gateway call
var apigClientFactory = require('aws-api-gateway-client').default;
var axios = require('axios');

class DiscoveryServiceSDK {

    constructor(serviceEndpointUri, region, credentials) {
        if (credentials.type == 'None') {
            this.apigClient = apigClientFactory.newClient({
                invokeUrl: serviceEndpointUri,
                accessKey: '',
                secretKey: '',
                region: region
            });
        }
        else if (credentials.type == 'IAM') {
            this.apigClient = apigClientFactory.newClient({
                invokeUrl: serviceEndpointUri,
                accessKey: credentials.accessKeyId,
                secretKey: credentials.secretAccessKey,
                region: region
            });
        }
        else if (credentials.type == 'BearerToken') {
            this.additionalParams = {
                headers: {
                    Authorization: 'Bearer ' + credentials.idToken
                }
            };
            this.apigClient = apigClientFactory.newClient({
                invokeUrl: serviceEndpointUri,
                accessKey: '',
                secretKey: '',
                region: region
            });
        }
        else {
            throw(Error('Unsupported credential type in DiscoveryServiceSDK'));
        }
    }

    getService(id) {
        var params = {};
        var pathTemplate = '/catalog/service/' + id;
        var method = 'GET';
        var additionalParams = {};
        var body = {};

        return this.apigClient.invokeApi(params, pathTemplate, method, additionalParams, body);
    }

    lookupService(ServiceName) {
        var params = {};
        var pathTemplate = '/catalog/service';
        var method = 'GET';
        var additionalParams = { queryParams: { ServiceName: ServiceName } };
        var body = {};

        return this.apigClient.invokeApi(params, pathTemplate, method, additionalParams, body);
    }

    createService(service) {
        var params = {};
        var pathTemplate = '/catalog/service';
        var method = 'POST';
        var additionalParams = {};
        var body = service;

        return this.apigClient.invokeApi(params, pathTemplate, method, additionalParams, body);
    }

    deleteService(id) {
        var params = {};
        var pathTemplate = '/catalog/service/' + id;
        var method = 'DELETE';
        var additionalParams = {};
        var body = {};

        return this.apigClient.invokeApi(params, pathTemplate, method, additionalParams, body);
    }
}

module.exports = DiscoveryServiceSDK;
