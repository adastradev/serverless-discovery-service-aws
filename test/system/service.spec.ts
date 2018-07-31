import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import * as chai from 'chai';
import * as mocha from 'mocha';
import { main } from '../../source/catalog/service-get';
import * as AWS from 'aws-sdk';
import * as DiscoveryServiceSDK from './sdk/DiscoveryServiceSDK';
import { Config } from '../../config';

const expect = chai.expect;
const should = chai.should();

describe('Catalog Service API', () => {
    describe('Basic API operations', () => {
        const credentials = {
            type: 'None'
        };

        const cloudformationOutput = require('./lib/outputs.json');
        const sdk = new DiscoveryServiceSDK(cloudformationOutput.ServiceEndpoint, Config.aws_region, credentials);

        const service = { ServiceName: 'SystemTest', ServiceStage: 'dev', ServiceURL: 'https://systemtest' };
        let newService;

        it('should create a service', async () => {
            const createResponse = await sdk.createService(service);
            expect(createResponse.status).to.equal(201);
            newService = createResponse.data;
        });

        it('should get a service by ID', async () => {
            const getResponse = await sdk.getService(newService.ServiceID);
            expect(getResponse.status).to.equal(200);
            expect(getResponse.data.ServiceName).to.equal(service.ServiceName);
            expect(getResponse.data.ServiceID).to.equal(newService.ServiceID);
        });

        it('should delete the service', async () => {
            const getResponse = await sdk.deleteService(newService.ServiceID);
            expect(getResponse.status).to.equal(204);
        });
    });
});
