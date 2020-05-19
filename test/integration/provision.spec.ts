import * as chai from 'chai';
import { main as mainProvision } from '../../source/provision';
import { main as mainDeprovision } from '../../source/deprovision';
import { APIGatewayProxyEvent } from 'aws-lambda';

const provisionTables = mainProvision;
const deprovisionTables = mainDeprovision;
const emptyEvent = {} as APIGatewayProxyEvent;

const expect = chai.expect;

describe('dynamo-provision', () => {

    after(async () => {
        const result = await deprovisionTables(emptyEvent, null);
    });

    it('should return Success when provisioning tables that do not yet exist', async () => {
        const result = await provisionTables(emptyEvent, null);
        expect(result.statusCode).to.be.equal(200);
    });

    it('should return Success when deprovisioning tables that exist in DynamoDB', async () => {
        await provisionTables(emptyEvent, null);
        const result = await deprovisionTables(emptyEvent, null);
        expect(result.statusCode).to.be.equal(200);
    });
});
