import * as chai from 'chai';
import { main as mainLookup } from '../../source/catalog/service-lookup';
import { CatalogServiceModel } from '../../source/catalog/model/CatalogServiceModel';
import * as util from 'util';
import { createFixture, deleteFixture } from '../mocks/helper';
import { tenantId1, tenantId2, tenantId3 } from '../mocks/mockData';

const lookupService = util.promisify(mainLookup);

const expect = chai.expect;

describe.only('service lookup by version or tenant id', () => {

    before(async () => {
        await createFixture();
    });

    after(async () => {
        await deleteFixture();
    });

    describe('Scenario: Return the right URL for a given service name and stage name', () => {
        it(`WHEN a servcice name and stage name is passed to the API
         THEN it should return the right URL`, async () => {
            const data = { queryStringParameters: { ServiceName: 'TestCourses', StageName: 'dev' }};
            const result = await lookupService(data, null);
            expect(result.statusCode).to.be.equal(200);
            const servicesJSON = JSON.parse(result.body);
            expect(servicesJSON.length).to.be.equal(1);

            const devService: CatalogServiceModel = Object.assign(new CatalogServiceModel(), servicesJSON[0]);
            devService.ServiceName.should.be.equal('TestCourses');
            devService.StageName.should.be.equal('dev');
            devService.ServiceURL.should.be.equal('http://url1.test.com/dev');
        });
    });
    describe('Scenario: Return the right URL for a given service name and stage name and tenant ID', () => {
        it.skip(`WHEN a servcice name, stage name and tenant ID is passed to the API
        THEN it should return the right URL`, async () => {
            const data = { queryStringParameters: {
                ExternalID: tenantId2,
                ServiceName: 'TestCourses',
                StageName: 'dev'
            }};
            const result = await lookupService(data, null);
            expect(result.statusCode).to.be.equal(200);
            const servicesJSON = JSON.parse(result.body);
            expect(servicesJSON.length).to.be.equal(1);

            const devService: CatalogServiceModel = Object.assign(new CatalogServiceModel(), servicesJSON[0]);
            devService.ServiceName.should.be.equal('TestCourses');
            devService.StageName.should.be.equal('dev');
            devService.ServiceURL.should.be.equal('http://url14.test.com/feat161');
        });
    });
    describe('Scenario: If there are multiple entries for a tenant, return the right URL', () => {
        it.skip(`WHEN a servcice name, stage name and tenant ID is passed to the API
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
    describe('Scenario: Use semver to determine the highest version', () => {
        it.skip(`WHEN a servcice name, stage name, tenant ID and version is passed to the API
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
    describe('Scenario: Return the version that is specified', () => {
        it.skip(`WHEN a servcice name, stage name, tenant ID and version is passed to the API
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
    describe('Scenario: Return the higher version URL if version specified doesn\'t exist', () => {
        it.skip(`WHEN a servcice name, stage name, tenant ID and version is passed to the API
        AND specified version is not available BUT higher version is available
        THEN return the URL for the higher version`, async () => {
            const data = { queryStringParameters: {
                ExternalID: tenantId1,
                ServiceName: 'TestTerm',
                StageName: 'dev',
                Version: '2.0.0'
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
    describe('Scenario: Return the default URL if version doesn\'t exist', () => {
        it.skip(` WHEN a servcice name, stage name, tenant ID and version is passed to the API
        AND specified or higher version is not available
        THEN return the default URL`, async () => {
            const data = { queryStringParameters: {
                ExternalID: tenantId1,
                ServiceName: 'TestTerm',
                StageName: 'dev',
                Version: '3'
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
    describe('Scenario: Return the default URL when there is no entry for a tenant', () => {
        it.skip(`WHEN a servcice name, stage name and tenant ID is passed to the API
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
            devService.ServiceURL.should.be.equal('http://url14.test.com/feat161');
        });
    });
    describe('Scenario: Should return the highest version available if given version is not present', () => {
        it.skip(`WHEN service name and specific version is provided to the API
        AND the specific version is not available BUT a higher version is available
        THEN it should return the highest available version`, async () => {
            const data = { queryStringParameters: {
                ServiceName: 'TestCampus',
                Version: '1'
            }};
            const result = await lookupService(data, null);
            expect(result.statusCode).to.be.equal(200);
            const servicesJSON = JSON.parse(result.body);
            expect(servicesJSON.length).to.be.equal(1);

            const devService: CatalogServiceModel = Object.assign(new CatalogServiceModel(), servicesJSON[0]);
            devService.ServiceName.should.be.equal('TestCampus');
            devService.ServiceURL.should.be.equal('http://url17.test.com/feat262');
        });
    });
    describe('Scenario: Throw error if invalid version is specified', () => {
        it.skip(`WHEN service name and specific version is provided to the API
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
    describe('Scenario: Throw an error if a invalid stage is provided', () => {
        it.skip(` WHEN an invalid stage is provided to the API
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
    describe('Scenario: Throw an error if no stage name is provided', () => {
        it.skip(`WHEN only service name is provided to the API
        THEN it should return a 404 error`, async () => {
            const data = { queryStringParameters: {
                ServiceName: 'TestTerm'
            }};
            const result = await lookupService(data, null);
            expect(result.statusCode).to.be.equal(404);
        });
    });
    describe('Scenario: Throw an error if a invalid service name is provided', () => {
        it.skip(`WHEN an invalid service name is provided to the API
        THEN it should return a 404 error`, async () => {
            const data = { queryStringParameters: {
                ServiceName: 'invalid_service'
            }};
            const result = await lookupService(data, null);
            expect(result.statusCode).to.be.equal(404);
        });
    });
    describe('Scenario: Use semver to determine the version, when no stage is passed', () => {
        it.skip(`WHEN service name and version is provided to the API
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
    describe('Scenario: Should be able to return a specific version if present', () => {
        it.skip(`WHEN service name and specific version is provided to the API
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
});
