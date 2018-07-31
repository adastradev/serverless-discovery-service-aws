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

        const service = { ServiceName: 'SystemTest', StageName: 'dev', ServiceURL: 'https://systemtest' };
        let newService;

        it('should create a service', async () => {
            const response = await sdk.createService(service);
            expect(response.status).to.equal(201);
            newService = response.data;
        });

        it('should get a service by ID', async () => {
            const response = await sdk.getService(newService.ServiceID);
            expect(response.status).to.equal(200);
            expect(response.data.ServiceName).to.equal(service.ServiceName);
            expect(response.data.ServiceID).to.equal(newService.ServiceID);
        });

        it('should get a service by Name', async () => {
            const response = await sdk.lookupService('SystemTest');
            expect(response.status).to.equal(200);
            expect(response.data.length).to.equal(1);
            expect(response.data[0].ServiceName).to.equal(service.ServiceName);
            expect(response.data[0].ServiceID).to.equal(newService.ServiceID);
        });

        it('should delete the service', async () => {
            const response = await sdk.deleteService(newService.ServiceID);
            expect(response.status).to.equal(204);
        });
    });
});
