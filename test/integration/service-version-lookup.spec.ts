import * as chai from 'chai';
import { main as mainLookup } from '../../source/catalog/service-lookup';
import { CatalogServiceModel } from '../../source/catalog/model/CatalogServiceModel';
import * as util from 'util';
import { createFixture, deleteFixture } from '../mocks/helper';
import { tenantId1, tenantId2, tenantId3 } from '../mocks/mockData';

const lookupService = util.promisify(mainLookup);

const expect = chai.expect;

describe('service lookup by version or tenant id', () => {

    before(async () => {
        await createFixture();
    });

    after(async () => {
        await deleteFixture();
    });

    describe('Scenario 1: Return the right URL for a given service name and stage name', () => {
        it(`WHEN a servcice name and stage name is passed to the API
         THEN it should return the right URL`, async () => {
            const data = { queryStringParameters: { ServiceName: 'TestCourse', StageName: 'dev' }};
            const result = await lookupService(data, null);
            expect(result.statusCode).to.be.equal(200);
            const servicesJSON = JSON.parse(result.body);
            expect(servicesJSON.length).to.be.equal(1);

            const devService: CatalogServiceModel = Object.assign(new CatalogServiceModel(), servicesJSON[0]);
            devService.ServiceName.should.be.equal('TestCourse');
            devService.StageName.should.be.equal('dev');
            devService.ServiceURL.should.be.equal('http://url1.test.com/dev');
        });
    });
    describe('Scenario 2: Return the right URL for a given service name and stage name and tenant ID', () => {
        it(`WHEN a servcice name, stage name and tenant ID is passed to the API
        THEN it should return the right URL`, async () => {
            const data = { queryStringParameters: {
                ExternalID: tenantId2,
                ServiceName: 'TestCourse',
                StageName: 'dev'
            }};
            const result = await lookupService(data, null);
            expect(result.statusCode).to.be.equal(200);
            const servicesJSON = JSON.parse(result.body);
            expect(servicesJSON.length).to.be.equal(1);

            const devService: CatalogServiceModel = Object.assign(new CatalogServiceModel(), servicesJSON[0]);
            devService.ServiceName.should.be.equal('TestCourse');
            devService.StageName.should.be.equal('dev');
            devService.ServiceURL.should.be.equal('http://url14.test.com/feat161');
        });
    });
    describe('Scenario 3: If there are multiple entries for a tenant, return the right URL', () => {
        it(`WHEN a servcice name, stage name and tenant ID is passed to the API
        AND there are multiple versions available for the tenant
        THEN it should return the URL for the highest version`, async () => {
            const data = { queryStringParameters: {
                ExternalID: tenantId1,
                ServiceName: 'TestTerm',
                StageName: 'dev'
            }};
            const result = await lookupService(data, null);
            expect(result.statusCode).to.be.equal(200);
            const servicesJSON = JSON.parse(result.body);
            expect(servicesJSON.length).to.be.equal(1);

            const devService: CatalogServiceModel = Object.assign(new CatalogServiceModel(), servicesJSON[0]);
            devService.ServiceName.should.be.equal('TestTerm');
            devService.StageName.should.be.equal('dev');
            devService.ServiceURL.should.be.equal('http://url12.test.com/feat201');
        });
    });
    describe('Scenario 4: Use semver to determine the highest version', () => {
        it(`WHEN a servcice name, stage name, tenant ID and version is passed to the API
        AND there are multiple versions available for the tenant
        THEN it should return the URL for the highest version`, async () => {
            const data = { queryStringParameters: {
                ExternalID: tenantId1,
                ServiceName: 'TestTerm',
                StageName: 'dev',
                Version: '1'
            }};
            const result = await lookupService(data, null);
            expect(result.statusCode).to.be.equal(200);
            const servicesJSON = JSON.parse(result.body);
            expect(servicesJSON.length).to.be.equal(1);

            const devService: CatalogServiceModel = Object.assign(new CatalogServiceModel(), servicesJSON[0]);
            devService.ServiceName.should.be.equal('TestTerm');
            devService.StageName.should.be.equal('dev');
            devService.ServiceURL.should.be.equal('http://url11.test.com/feat112');
        });
    });
    describe('Scenario 5: Return the version that is specified', () => {
        it(`WHEN a servcice name, stage name, tenant ID and version is passed to the API
        AND the version is specific and available in the data
        THEN return the specified version`, async () => {
            const data = { queryStringParameters: {
                ExternalID: tenantId1,
                ServiceName: 'TestTerm',
                StageName: 'dev',
                Version: '1.0.1'
            }};
            const result = await lookupService(data, null);
            expect(result.statusCode).to.be.equal(200);
            const servicesJSON = JSON.parse(result.body);
            expect(servicesJSON.length).to.be.equal(1);

            const devService: CatalogServiceModel = Object.assign(new CatalogServiceModel(), servicesJSON[0]);
            devService.ServiceName.should.be.equal('TestTerm');
            devService.StageName.should.be.equal('dev');
            devService.ServiceURL.should.be.equal('http://url10.test.com/feat101');
        });
    });
    describe('Scenario 6: Return the default URL when there is no entry for a tenant', () => {
        it(`WHEN a servcice name, stage name and tenant ID is passed to the API
        AND there is no entry for the tenant
        THEN return the default URL`, async () => {
            const data = { queryStringParameters: {
                ExternalID: tenantId3,
                ServiceName: 'TestTerm',
                StageName: 'dev'
            }};
            const result = await lookupService(data, null);
            expect(result.statusCode).to.be.equal(200);
            const servicesJSON = JSON.parse(result.body);
            expect(servicesJSON.length).to.be.equal(1);

            const devService: CatalogServiceModel = Object.assign(new CatalogServiceModel(), servicesJSON[0]);
            devService.ServiceName.should.be.equal('TestTerm');
            devService.StageName.should.be.equal('dev');
            devService.ServiceURL.should.be.equal('http://url4.test.com/dev');
        });
    });
    describe('Scenario 7: Throw error if invalid version is specified', () => {
        it(`WHEN service name and specific version is provided to the API
        AND no higher version is available
        THEN it should throw error`, async () => {
            const data = { queryStringParameters: {
                ServiceName: 'TestCampus',
                Version: '3'
            }};
            const result = await lookupService(data, null);
            expect(result.statusCode).to.be.equal(404);
        });
    });
    describe('Scenario 8: Throw an error if a invalid stage is provided', () => {
        it(` WHEN an invalid stage is provided to the API
        THEN it should return a 404 error`, async () => {
            const data = { queryStringParameters: {
                ExternalID: tenantId1,
                ServiceName: 'TestTerm',
                StageName: 'invalid_stage'
            }};
            const result = await lookupService(data, null);
            expect(result.statusCode).to.be.equal(404);
        });
    });
    describe('Scenario 9: If only service name is provided, return latest non-stage version available', () => {
        it(`WHEN only service name is provided to the API
        THEN it should provide highest non-stage, non-tenant version`, async () => {
            const data = { queryStringParameters: {
                ServiceName: 'TestTerm'
            }};
            const result = await lookupService(data, null);
            const servicesJSON = JSON.parse(result.body);
            expect(servicesJSON.length).to.be.equal(1);

            const devService: CatalogServiceModel = Object.assign(new CatalogServiceModel(), servicesJSON[0]);
            devService.ServiceName.should.be.equal('TestTerm');
            devService.ServiceURL.should.be.equal('http://url18.test.com/feat201');
        });
    });
    describe('Scenario 10: Throw an error if a invalid service name is provided', () => {
        it(`WHEN an invalid service name is provided to the API
        THEN it should return a 404 error`, async () => {
            const data = { queryStringParameters: {
                ServiceName: 'invalid_service'
            }};
            const result = await lookupService(data, null);
            expect(result.statusCode).to.be.equal(404);
        });
    });
    describe('Scenario 11: Use semver to determine the version, when no stage is passed', () => {
        it(`WHEN service name and version is provided to the API
        THEN it should return the url for the highest version`, async () => {
            const data = { queryStringParameters: {
                ServiceName: 'TestCampus',
                Version: '2'
            }};
            const result = await lookupService(data, null);
            const servicesJSON = JSON.parse(result.body);
            expect(servicesJSON.length).to.be.equal(1);

            const devService: CatalogServiceModel = Object.assign(new CatalogServiceModel(), servicesJSON[0]);
            devService.ServiceName.should.be.equal('TestCampus');
            devService.ServiceURL.should.be.equal('http://url17.test.com/feat262');
        });
    });
    describe('Scenario 12: Should be able to return a specific version if present', () => {
        it(`WHEN service name and specific version is provided to the API
        THEN it should return the url for the given version`, async () => {
            const data = { queryStringParameters: {
                ServiceName: 'TestCampus',
                Version: '2.6.1'
            }};
            const result = await lookupService(data, null);
            const servicesJSON = JSON.parse(result.body);
            expect(servicesJSON.length).to.be.equal(1);

            const devService: CatalogServiceModel = Object.assign(new CatalogServiceModel(), servicesJSON[0]);
            devService.ServiceName.should.be.equal('TestCampus');
            devService.ServiceURL.should.be.equal('http://url16.test.com/feat261');
        });
    });
    describe('Scenario 13: Should be able to return a staging version from ranged request', () => {
        it(`WHEN service name and ranged staging version is provided to the API
        THEN it should return the url for the given version`, async () => {
            const data = { queryStringParameters: {
                ServiceName: 'StagingTest',
                Version: '5.x.x-staging'
            }};
            const result = await lookupService(data, null);
            const servicesJSON = JSON.parse(result.body);
            expect(servicesJSON.length).to.be.equal(1);

            const devService: CatalogServiceModel = Object.assign(new CatalogServiceModel(), servicesJSON[0]);
            devService.ServiceName.should.be.equal('StagingTest');
            devService.ServiceURL.should.be.equal('http://url21.com/5-0-0-staging');
        });
        it(`WHEN service name and ranged staging version is provided to the API
        THEN it should return the url for the given version`, async () => {
            const data = { queryStringParameters: {
                ServiceName: 'StagingTest',
                Version: '3.x-staging'
            }};
            const result = await lookupService(data, null);
            const servicesJSON = JSON.parse(result.body);
            expect(servicesJSON.length).to.be.equal(1);

            const devService2: CatalogServiceModel = Object.assign(new CatalogServiceModel(), servicesJSON[0]);
            devService2.ServiceName.should.be.equal('StagingTest');
            devService2.ServiceURL.should.be.equal('http://url22.com/3-7-9-staging');
        });
        it(`WHEN service name and ranged NON-staging version is provided to the API
        THEN it should return the url for the correct version`, async () => {
            const data = { queryStringParameters: {
                ServiceName: 'StagingTest',
                Version: '3.x'
            }};
            const result = await lookupService(data, null);
            const servicesJSON = JSON.parse(result.body);
            expect(servicesJSON.length).to.be.equal(1);

            const devService2: CatalogServiceModel = Object.assign(new CatalogServiceModel(), servicesJSON[0]);
            devService2.ServiceName.should.be.equal('StagingTest');
            devService2.ServiceURL.should.be.equal('http://url21.com/3-7-9');
        });
    });
});
