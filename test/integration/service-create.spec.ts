import * as chai from 'chai';
import { main as mainCreate } from '../../source/catalog/service-create';
import { main as mainDelete } from '../../source/catalog/service-delete';
import { CatalogServiceModel } from '../../source/catalog/model/CatalogServiceModel';
import { APIGatewayProxyEvent } from 'aws-lambda';

const createService = mainCreate;
const deleteService = mainDelete;

const expect = chai.expect;

describe('service-create', () => {
    const ServiceIDs: string[] = [];

    after(async () => {

        ServiceIDs.forEach(async (ServiceID) => {
            const data = {} as APIGatewayProxyEvent;
            data.pathParameters = { id: ServiceID };
            await deleteService(data, null);
        });
    });

    it('should return Success (created) for a new registration', async () => {
        const data = require('./mocks/service-create');
        const result = await createService(data, null);
        expect(result.statusCode).to.be.equal(201); // Created
        const newService: CatalogServiceModel = Object.assign(new CatalogServiceModel(), JSON.parse(result.body));
        ServiceIDs.push(newService.ServiceID);
        newService.ServiceName.should.be.equal('Discovery');
    });

    it('should return Success (updated) for an existing registration', async () => {
        const event = require('./mocks/service-create');
        const devData = { ServiceName: 'Discovery', StageName: 'dev', ServiceURL: 'https://newServiceLocation' };
        event.body = JSON.stringify(devData);
        const result = await createService(event, null);
        expect(result.statusCode).to.be.equal(200); // Ok
        const newService: CatalogServiceModel = Object.assign(new CatalogServiceModel(), JSON.parse(result.body));
        newService.ServiceName.should.be.equal('Discovery');
        newService.ServiceURL.should.be.equal('https://newServiceLocation');
    });

    it('should return Success (created) for a new registration with External ID', async () => {
        const data = require('./mocks/service-create-external-id');
        const result = await createService(data, null);
        expect(result.statusCode).to.be.equal(201); // Created
        const newService: CatalogServiceModel = Object.assign(new CatalogServiceModel(), JSON.parse(result.body));
        ServiceIDs.push(newService.ServiceID);
        newService.ServiceName.should.be.equal('Discovery');
        newService.ExternalID.should.be.equal('95a575de-9afe-4ef9-93e9-d17654ef149f');
        newService.Version.should.be.equal('1.5.4');
    });

    it('should return Success (updated) for an existing registration with External ID', async () => {
        const event = require('./mocks/service-create-external-id');
        const devData = {
            ExternalID: '95a575de-9afe-4ef9-93e9-d17654ef149f',
            ServiceName: 'Discovery',
            ServiceURL: 'https://newServiceLocation'
        };
        event.body = JSON.stringify(devData);
        const result = await createService(event, null);
        expect(result.statusCode).to.be.equal(200); // Ok
        const newService: CatalogServiceModel = Object.assign(new CatalogServiceModel(), JSON.parse(result.body));
        newService.ServiceName.should.be.equal('Discovery');
        newService.ServiceURL.should.be.equal('https://newServiceLocation');
    });

    it('should return Success (created) for a new registration with Version', async () => {
        const data = require('./mocks/service-create-version');
        const result = await createService(data, null);
        expect(result.statusCode).to.be.equal(201); // Created
        const newService: CatalogServiceModel = Object.assign(new CatalogServiceModel(), JSON.parse(result.body));
        ServiceIDs.push(newService.ServiceID);
        newService.ServiceName.should.be.equal('Discovery');
        newService.Version.should.be.equal('1.2.3');
    });

    it('should return Success (updated) for an existing registration with Version', async () => {
        const event = require('./mocks/service-create-version');
        const devData = {
            ServiceName: 'Discovery',
            ServiceURL: 'https://newServiceLocation',
            Version: '1.2.3'
        };
        event.body = JSON.stringify(devData);
        const result = await createService(event, null);
        expect(result.statusCode).to.be.equal(200); // Ok
        const newService: CatalogServiceModel = Object.assign(new CatalogServiceModel(), JSON.parse(result.body));
        newService.ServiceName.should.be.equal('Discovery');
        newService.ServiceURL.should.be.equal('https://newServiceLocation');
        newService.Version.should.be.equal('1.2.3');
    });

});
