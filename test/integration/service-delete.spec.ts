import { APIGatewayProxyEvent } from 'aws-lambda';
import * as chai from 'chai';
import * as mocha from 'mocha';
import { main as mainCreate } from '../../source/catalog/service-create';
import { main as mainGet } from '../../source/catalog/service-get';
import { main as mainDelete } from '../../source/catalog/service-delete';
import { CatalogServiceModel } from '../../source/catalog/model/CatalogServiceModel';

const createService = mainCreate;
const getService = mainGet;
const deleteService = mainDelete;

const expect = chai.expect;
const should = chai.should();

describe('service-delete', () => {
    let ServiceID = null;

    before(async () => {
        const data = require('./mocks/service-create');
        const result = await createService(data, null);
        const responseJson = JSON.parse(result.body);
        ServiceID = responseJson.ServiceID;
    });

    after(async () => {
        const data = {} as APIGatewayProxyEvent;
        data.pathParameters = { id: ServiceID };
        const result = await deleteService(data, null);
    });

    it('should return Success when deleting an extant service', async () => {
        const data = {} as APIGatewayProxyEvent;
        data.pathParameters = { id: ServiceID };
        const result = await deleteService(data, null);
        expect(result.statusCode).to.be.equal(204);

        const getResult = await getService(data, null);
        expect(getResult.statusCode).to.be.equal(404);
    });
});
