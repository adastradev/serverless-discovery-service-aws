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
            const result = controller.filterVersion('1', tenantId1, 'dev', testTerm);
            expect(result.ServiceURL).equals('http://url11.test.com/feat112');
        });
    });

    describe('Scenario 5', () => {
        it('Test 1', () => {
            const result = controller.filterVersion('1.0.1', tenantId1, 'dev', testTerm);
            expect(result.ServiceURL).equals('http://url10.test.com/feat101');
        });
    });

    describe('Scenario 6', () => {
        it('Test 1', () => {
            const result = controller.filterVersion('2.0.0', tenantId1, 'dev', testTerm);
            expect(result.ServiceURL).equals('http://url12.test.com/feat201');
        });
    });

    describe('Scenario 7', () => {
        it('Test 1', () => {
            const result = controller.filterVersion('3', tenantId1, 'dev', testTerm);
            expect(result.ServiceURL).equals('http://url4.test.com/dev');
        });
    });

    describe('Scenario 8', () => {
        it('Test 1', () => {
            const result = controller.filterVersion(undefined, tenantId3, 'dev', testTerm);
            expect(result.ServiceURL).equals('http://url4.test.com/dev');
        });
    });

    describe('Scenario 9', () => {
        it('Test 1', () => {
            const result = controller.filterVersion('1', undefined, undefined, testCampus);
            expect(result.ServiceURL).equals('http://url17.test.com/feat262');
        });

        it('Test 2', () => {
            const result = controller.filterVersion('2', undefined, undefined, testCampus);
            expect(result.ServiceURL).equals('http://url17.test.com/feat262');
        });
    });

    describe('Scenario 10', () => {
        it('Test 1', () => {
            expect(() => controller.filterVersion('3', undefined, undefined, testCampus)).to.throw();
        });

        it('Test 2', () => {
            expect(() => controller.filterVersion('3.2.1', undefined, undefined, testCampus)).to.throw();
        });
    });

    describe('Scenario 11', () => {
        it('Test 1', () => {
            expect(() => controller.filterVersion(undefined, tenantId1, 'invalid_stage', testTerm)).to.throw();
        });

        it('Test 2', () => {
            expect(() => controller.filterVersion(undefined, undefined, 'invalid_stage', testTerm)).to.throw();
        });
    });

    describe('Scenario 12', () => {
        it('Test 1', () => {
            expect(() => controller.filterVersion(undefined, undefined, undefined, testTerm)).to.throw();
        });
    });

    describe('Scenario 13', () => {
        // Outside the scope of unit tests
    });

    describe('Scenario 14', () => {
        it('Test 1', () => {
            const result = controller.filterVersion('2', undefined, undefined, testCampus);
            expect(result.ServiceURL).equals('http://url17.test.com/feat262');
        });
    });

    describe('Scenario 15', () => {
        it('Test 1', () => {
            const result = controller.filterVersion('2.6.1', undefined, undefined, testCampus);
            expect(result.ServiceURL).equals('http://url16.test.com/feat261');
        });
    });
});
