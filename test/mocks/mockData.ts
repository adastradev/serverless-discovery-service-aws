import uuid from 'uuidv4';
import { CatalogServiceModel } from '../../source/catalog/model/CatalogServiceModel';

export const tenantId1 = uuid();
export const tenantId2 = uuid();
export const tenantId3 = uuid();

export const mockData: CatalogServiceModel[] = [
    // TestCourse entries for different stages
    {
        CreatedAt: new Date(),
        ExternalID: undefined,
        ServiceID: uuid(),
        ServiceName: 'TestCourses',
        ServiceURL: 'http://url1.test.com/dev',
        StageName: 'dev',
        Version: undefined
    },
    {
        CreatedAt: new Date(),
        ExternalID: undefined,
        ServiceID: uuid(),
        ServiceName: 'TestCourses',
        ServiceURL: 'http://url2.test.com/staging',
        StageName: 'staging',
        Version: undefined
    },
    {
        CreatedAt: new Date(),
        ExternalID: undefined,
        ServiceID: uuid(),
        ServiceName: 'TestCourses',
        ServiceURL: 'http://url3.test.com/prod',
        StageName: 'prod',
        Version: undefined
    },
    // TestTerm entries for different stages
    {
        CreatedAt: new Date(),
        ExternalID: undefined,
        ServiceID: uuid(),
        ServiceName: 'TestTerm',
        ServiceURL: 'http://url4.test.com/dev',
        StageName: 'dev',
        Version: undefined
    },
    {
        CreatedAt: new Date(),
        ExternalID: undefined,
        ServiceID: uuid(),
        ServiceName: 'TestTerm',
        ServiceURL: 'http://url5.test.com/staging',
        StageName: 'staging',
        Version: undefined
    },
    {
        CreatedAt: new Date(),
        ExternalID: undefined,
        ServiceID: uuid(),
        ServiceName: 'TestTerm',
        ServiceURL: 'http://url6.test.com/prod',
        StageName: 'prod',
        Version: undefined
    },
    // TestCampus entries for different stages
    {
        CreatedAt: new Date(),
        ExternalID: undefined,
        ServiceID: uuid(),
        ServiceName: 'TestCampus',
        ServiceURL: 'http://url7.test.com/dev',
        StageName: 'dev',
        Version: undefined
    },
    {
        CreatedAt: new Date(),
        ExternalID: undefined,
        ServiceID: uuid(),
        ServiceName: 'TestCampus',
        ServiceURL: 'http://url8.test.com/staging',
        StageName: 'staging',
        Version: undefined
    },
    {
        CreatedAt: new Date(),
        ExternalID: undefined,
        ServiceID: uuid(),
        ServiceName: 'TestCampus',
        ServiceURL: 'http://url9.test.com/prod',
        StageName: 'prod',
        Version: undefined
    },
    // entries for tenant ID 1
    { // Different versions for TestTerm to test semver
        CreatedAt: new Date(),
        ExternalID: tenantId1,
        ServiceID: uuid(),
        ServiceName: 'TestTerm',
        ServiceURL: 'http://url10.test.com/feat101',
        StageName: 'dev',
        Version: '1.0.1'
    },
    {
        CreatedAt: new Date(),
        ExternalID: tenantId1,
        ServiceID: uuid(),
        ServiceName: 'TestTerm',
        ServiceURL: 'http://url11.test.com/feat112',
        StageName: 'dev',
        Version: '1.1.2'
    },
    {
        CreatedAt: new Date(),
        ExternalID: tenantId1,
        ServiceID: uuid(),
        ServiceName: 'TestTerm',
        ServiceURL: 'http://url12.test.com/feat201',
        StageName: 'dev',
        Version: '2.0.1'
    },
    {
        CreatedAt: new Date(),
        ExternalID: tenantId1,
        ServiceID: uuid(),
        ServiceName: 'TestCourse',
        ServiceURL: 'http://url13.test.com/feat151',
        StageName: 'dev',
        Version: '1.5.1'
    },
    { // different versions for TestCourse
        CreatedAt: new Date(),
        ExternalID: tenantId2,
        ServiceID: uuid(),
        ServiceName: 'TestCourse',
        ServiceURL: 'http://url14.test.com/feat161',
        StageName: 'dev',
        Version: '1.6.1'
    },
    { // different versions for TestCourse
        CreatedAt: new Date(),
        ExternalID: tenantId2,
        ServiceID: uuid(),
        ServiceName: 'TestCourse',
        ServiceURL: 'http://url15.test.com/feat161',
        StageName: 'prod',
        Version: '1.6.1'
    }
];
