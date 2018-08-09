import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import * as chai from 'chai';
import { DiscoveryServiceApi, ServiceApiModel } from '@adastradev/serverless-discovery-sdk';
import { Config } from '../../config';

const expect = chai.expect;

describe('Catalog Service API', () => {
    describe('Basic API operations', () => {
        const cloudformationOutput = require('./lib/outputs.json');
        const discoveryApi = new DiscoveryServiceApi(cloudformationOutput.ServiceEndpoint,
            Config.aws_region,
            { type: 'None' });

        const service: ServiceApiModel = {
            ServiceName: 'SystemTest',
            ServiceURL: 'https://systemtest',
            StageName: 'dev'
        };
        let newService;

        it('should create a service', async () => {
            const response = await discoveryApi.createService(service);
            expect(response.status).to.equal(201);
            newService = response.data;
        }).timeout(60000);

        it('should get a service by ID', async () => {
            const response = await discoveryApi.getService(newService.ServiceID);
            expect(response.status).to.equal(200);
            expect(response.data.ServiceName).to.equal(service.ServiceName);
            expect(response.data.ServiceID).to.equal(newService.ServiceID);
        });

        it('should get a service by Name', async () => {
            const response = await discoveryApi.lookupService('SystemTest');
            expect(response.status).to.equal(200);
            expect(response.data.length).to.equal(1);
            expect(response.data[0].ServiceName).to.equal(service.ServiceName);
            expect(response.data[0].ServiceID).to.equal(newService.ServiceID);
        });

        it('should get a service by Name and Stage', async () => {
            const response = await discoveryApi.lookupService('SystemTest', 'dev');
            expect(response.status).to.equal(200);
            expect(response.data.length).to.equal(1);
            expect(response.data[0].ServiceName).to.equal(service.ServiceName);
            expect(response.data[0].ServiceID).to.equal(newService.ServiceID);
        });

        it('should delete the service', async () => {
            const response = await discoveryApi.deleteService(newService.ServiceID);
            expect(response.status).to.equal(204);
        });
    });
});
