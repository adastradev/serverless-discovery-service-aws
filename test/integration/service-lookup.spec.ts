import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
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

    before(async () => {
        const event = require('./mocks/service-empty-body');

        // create two services with different stages
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
    });

    after(async () => {
        await deleteService({ pathParameters: { id: ServiceIDDev } }, null);
        await deleteService({ pathParameters: { id: ServiceIDProd } }, null);
    });

    it('should return Success and an array of results when looking up a service by name', async () => {
        const data = { queryStringParameters: { ServiceName: 'Discovery' }};
        const result = await lookupService(data, null);
        expect(result.statusCode).to.be.equal(200);
        const servicesJSON = JSON.parse(result.body);
        expect(servicesJSON.length).to.be.equal(2);

        const devService: CatalogServiceModel = Object.assign(new CatalogServiceModel(), servicesJSON[0]);
        devService.ServiceName.should.be.equal('Discovery');
        devService.StageName.should.be.equal('dev');
        devService.ServiceID.should.be.equal(ServiceIDDev);

        const prodService: CatalogServiceModel = Object.assign(new CatalogServiceModel(), servicesJSON[1]);
        prodService.ServiceName.should.be.equal('Discovery');
        prodService.StageName.should.be.equal('prod');
        prodService.ServiceID.should.be.equal(ServiceIDProd);
    });
});
