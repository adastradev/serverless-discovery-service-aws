import * as chai from 'chai';
import CatalogServiceController from '../../source/catalog/controller/CatalogServiceController';
import {mockData} from '../mocks/mockData';

const expect = chai.expect;

describe('CatalogServiceController', () => {
    const controller = new CatalogServiceController();
    const testCourses = mockData.filter((record) => record.ServiceName === 'TestCourse');
    const testTerm = mockData.filter((record) => record.ServiceName === 'TestTerm');

    it ('Scenario 1', () => {
        const result = controller.filterVersion(undefined, undefined, 'dev', testCourses);
        expect(result.ServiceURL).equals('http://url1.test.com/dev');
    });
});
