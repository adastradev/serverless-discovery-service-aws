import * as chai from 'chai';
import CatalogServiceController from '../../source/catalog/controller/CatalogServiceController';
import {mockData, tenantId1, tenantId2, tenantId3} from '../mocks/mockData';

const expect = chai.expect;

describe('CatalogServiceController', () => {
    const controller = new CatalogServiceController();
    const testCourse = mockData.filter((record) => record.ServiceName === 'TestCourse');
    const testTerm = mockData.filter((record) => record.ServiceName === 'TestTerm');
    const testCampus = mockData.filter((record) => record.ServiceName === 'TestCampus');

    describe('Scenario 1', () => {
        it('Test 1', () => {
            const result = controller.filterVersion(undefined, undefined, 'dev', testCourse);
            expect(result.ServiceURL).equals('http://url1.test.com/dev');
        });
    });

    describe('Scenario 2', () => {
        it('Test 1', () => {
            const result = controller.filterVersion(undefined, tenantId2, 'dev', testCourse);
            expect(result.ServiceURL).equals('http://url14.test.com/feat161');
        });

        it('Test 2', () => {
            const result = controller.filterVersion(undefined, tenantId2, 'prod', testCourse);
            expect(result.ServiceURL).equals('http://url15.test.com/feat161');
        });
    });

    describe('Scenario 3', () => {
        it('Test 1', () => {
            const result = controller.filterVersion(undefined, tenantId1, 'dev', testTerm);
            expect(result.ServiceURL).equals('http://url12.test.com/feat201');
        });
    });

    describe('Scenario 4', () => {
        it('Test 1', () => {
            const result = controller.filterVersion('1.x.x', tenantId1, 'dev', testTerm);
            expect(result.ServiceURL).equals('http://url11.test.com/feat112');
        });
    });

});
