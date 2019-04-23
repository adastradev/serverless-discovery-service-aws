import { mockData, tenantId1, tenantId2 } from './mockData';
import CatalogServiceController from '../../source/catalog/controller/CatalogServiceController';
import { CatalogServiceModel } from '../../source/catalog/model/CatalogServiceModel';

const savedRecords: CatalogServiceModel[] = new Array<CatalogServiceModel>();
/**
 * Create fixture data
 * @param services any additional services that you want to create for your specific fixture
 * @param createDefault Set to false if you don't want the default fixture data to get created
 */
export const createFixture = async (services?: CatalogServiceModel[], createDefault: boolean = true) => {
    const controller = new CatalogServiceController();
    console.log('Creating fixtures');
    // save default data
    if (createDefault) {
        for (const data of mockData) {
            const toSave = Object.assign(new CatalogServiceModel(), data);
            const response = await controller.create(toSave);
            savedRecords.push(JSON.parse(response.body));
        }
        console.log(`Created ${mockData.length} fixtures`);
    }
    // save additional data provided
    if (services) {
        for (const data of services) {
            const toSave = Object.assign(new CatalogServiceModel(), data);
            const response = await controller.create(toSave);
            savedRecords.push(JSON.parse(response.body));
        }
        console.log(`Created ${mockData.length} additional fixtures`);
    }
};

/**
 * Delete all fixture data
 */
export const deleteFixture = async () => {
    const controller = new CatalogServiceController();
    console.log('Deleting fixtures');
    // delete alll records that are saved
    if (savedRecords.length > 0) {
        for (const data of savedRecords) {
            const toDelete = Object.assign(new CatalogServiceModel(), data);
            await controller.delete(toDelete);
        }
        console.log(`Deleted ${savedRecords.length} fixtures`);
    }
};
