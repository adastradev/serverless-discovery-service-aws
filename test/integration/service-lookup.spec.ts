import { APIGatewayProxyEvent } from 'aws-lambda';
import * as chai from 'chai';
import * as mocha from 'mocha';
import { main as mainCreate } from '../../source/catalog/service-create';
import { main as mainLookup } from '../../source/catalog/service-lookup';
import { main as mainDelete } from '../../source/catalog/service-delete';
import { CatalogServiceModel } from '../../source/catalog/model/CatalogServiceModel';
import * as util from 'util';

const createService = util.promisify(mainCreate);
const lookupService = util.promisify(mainLookup);
const deleteService = util.promisify(mainDelete);

const expect = chai.expect;
const should = chai.should();

describe('service-lookup', () => {
    let ServiceIDDev = null;
    let ServiceIDProd = null;
    let ServiceIDByExternalId = null;
    let ServiceIDByVersion = null;
    const externalTestId = '95a575de-9afe-4ef9-93e9-d17654ef149f';
    const testVersionNumber = '1.2.3';

    before(async () => {
        const event = require('./mocks/service-empty-body');

        // create four services with different stages
        const devData = { ServiceName: 'Discovery', StageName: 'dev', ServiceURL: 'https://test' };
        event.body = JSON.stringify(devData);
        const resultDev = await createService(event, null);
        const responseJsonDev = JSON.parse(resultDev.body);
        ServiceIDDev = responseJsonDev.ServiceID;

        const prodData = { ServiceName: 'Discovery', StageName: 'prod', ServiceURL: 'https://test' };
        event.body = JSON.stringify(prodData);
        const resultProd = await createService(event, null);
        const responseJsonProd = JSON.parse(resultProd.body);
        ServiceIDProd = responseJsonProd.ServiceID;

        const externalIdData = {
            ExternalID: externalTestId,
            ServiceName: 'Discovery',
            ServiceURL: 'https://test',
            Version: testVersionNumber
        };
        event.body = JSON.stringify(externalIdData);
        const resultByExternalId = await createService(event, null);
        const responseJsonByExternalId = JSON.parse(resultByExternalId.body);
        ServiceIDByExternalId = responseJsonByExternalId.ServiceID;

        const byVersionData = {
            ServiceName: 'Discovery',
            ServiceURL: 'https://test',
            Version: testVersionNumber
        };
        event.body = JSON.stringify(byVersionData);
        const resultByVersion = await createService(event, null);
        const responseJsonByVersion = JSON.parse(resultByVersion.body);
        ServiceIDByVersion = responseJsonByVersion.ServiceID;
    });

    after(async () => {
        const data = {} as APIGatewayProxyEvent;
        data.pathParameters = { id: ServiceIDDev };
        await deleteService(data, null);
        data.pathParameters = { id: ServiceIDProd };
        await deleteService(data, null);
        data.pathParameters = { id: ServiceIDByExternalId };
        await deleteService(data, null);
        data.pathParameters = { id: ServiceIDByVersion };
        await deleteService(data, null);
    });

    it(`should return Success and a single non-stage result with the highest version
        when looking up a service by name only`, async () => {
        const data = {} as APIGatewayProxyEvent;
        data.queryStringParameters = { ServiceName: 'Discovery' };
        const result = await lookupService(data, null);
        expect(result.statusCode).to.be.equal(200);
        const servicesJSON = JSON.parse(result.body);
        expect(servicesJSON.length).to.be.equal(1);

        const prodService: CatalogServiceModel = Object.assign(new CatalogServiceModel(), servicesJSON[0]);
        prodService.ServiceName.should.be.equal('Discovery');
        prodService.Version.should.be.equal(testVersionNumber);
        prodService.ServiceID.should.be.equal(ServiceIDByVersion);
    });

    it('should return Success and a single result when looking up a service by name and stage', async () => {
        const data = {} as APIGatewayProxyEvent;
        data.queryStringParameters = { ServiceName: 'Discovery', StageName: 'prod' };
        const result = await lookupService(data, null);
        expect(result.statusCode).to.be.equal(200);
        const servicesJSON = JSON.parse(result.body);
        expect(servicesJSON.length).to.be.equal(1);

        const prodService: CatalogServiceModel = Object.assign(new CatalogServiceModel(), servicesJSON[0]);
        prodService.ServiceName.should.be.equal('Discovery');
        prodService.StageName.should.be.equal('prod');
        prodService.ServiceID.should.be.equal(ServiceIDProd);
    });

    it('should return Success and a single result when looking up a service by name and external id', async () => {
        const data = {} as APIGatewayProxyEvent;
        data.queryStringParameters = {
            ExternalID: externalTestId,
            ServiceName: 'Discovery'
        };
        const result = await lookupService(data, null);
        expect(result.statusCode).to.be.equal(200);
        const servicesJSON = JSON.parse(result.body);
        expect(servicesJSON.length).to.be.equal(1);

        const prodService: CatalogServiceModel = Object.assign(new CatalogServiceModel(), servicesJSON[0]);
        prodService.ServiceName.should.be.equal('Discovery');
        prodService.Version.should.be.equal(testVersionNumber);
        prodService.ServiceID.should.be.equal(ServiceIDByExternalId);
    });

    it('should return Success and a single result when looking up a service by name and version', async () => {
        const data = {} as APIGatewayProxyEvent;
        data.queryStringParameters = {
            ServiceName: 'Discovery',
            Version: testVersionNumber };
        const result = await lookupService(data, null);
        expect(result.statusCode).to.be.equal(200);
        const servicesJSON = JSON.parse(result.body);
        expect(servicesJSON.length).to.be.equal(1);

        const prodService: CatalogServiceModel = Object.assign(new CatalogServiceModel(), servicesJSON[0]);
        prodService.ServiceName.should.be.equal('Discovery');
        prodService.Version.should.be.equal(testVersionNumber);
        prodService.ServiceID.should.be.equal(ServiceIDByVersion);
    });
});
