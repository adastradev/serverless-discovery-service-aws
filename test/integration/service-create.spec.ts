import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import * as chai from 'chai';
import * as mocha from 'mocha';
import { main as mainCreate } from '../../source/catalog/service-create';
import { main as mainDelete } from '../../source/catalog/service-delete';
import { CatalogServiceModel } from '../../source/catalog/model/CatalogServiceModel';
import * as util from 'util';

const createService = util.promisify(mainCreate);
const deleteService = util.promisify(mainDelete);

const expect = chai.expect;
const should = chai.should();

describe('service-create', () => {
    let ServiceID = null;

    after(async () => {
        const data = { pathParameters: { id: ServiceID }};
        const result = await deleteService(data, null);
    });

    it('should return Success (created) for a new registration', async () => {
        const data = require('./mocks/service-create');
        const result = await createService(data, null);
        expect(result.statusCode).to.be.equal(201); // Created
        const newService: CatalogServiceModel = Object.assign(new CatalogServiceModel(), JSON.parse(result.body));
        ServiceID = newService.ServiceID;
        newService.ServiceName.should.be.equal('Discovery');
    });

    it('should return Success (updated) for an existing registration', async () => {
        const event = require('./mocks/service-create');
        const devData = { ServiceName: 'Discovery', StageName: 'dev', ServiceURL: 'https://newServiceLocation' };
        event.body = JSON.stringify(devData);
        const result = await createService(event, null);
        expect(result.statusCode).to.be.equal(200); // Ok
        const newService: CatalogServiceModel = Object.assign(new CatalogServiceModel(), JSON.parse(result.body));
        ServiceID = newService.ServiceID;
        newService.ServiceName.should.be.equal('Discovery');
        newService.ServiceURL.should.be.equal('https://newServiceLocation');
    });
});
