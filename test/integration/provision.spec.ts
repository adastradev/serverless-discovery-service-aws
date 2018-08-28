import * as chai from 'chai';
import { main as mainProvision } from '../../source/provision';
import { main as mainDeprovision } from '../../source/deprovision';
import * as util from 'util';

const provisionTables = util.promisify(mainProvision);
const deprovisionTables = util.promisify(mainDeprovision);

const expect = chai.expect;

describe('dynamo-provision', () => {

    after(async () => {
        const result = await deprovisionTables({}, null);
    });

    it('should return Success when provisioning tables that do not yet exist', async () => {
        const result = await provisionTables({}, null);
        expect(result.statusCode).to.be.equal(200);
    });

    it('should return Success when deprovisioning tables that exist in DynamoDB', async () => {
        await provisionTables({}, null);
        const result = await deprovisionTables({}, null);
        expect(result.statusCode).to.be.equal(200);
    });
});
