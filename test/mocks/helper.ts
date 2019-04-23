import { mockData } from './mockData';
import CatalogServiceController from '../../source/catalog/controller/CatalogServiceController';
import { CatalogServiceModel } from '../../source/catalog/model/CatalogServiceModel';

let additionalData: CatalogServiceModel[];
let saveDefault: boolean;

/**
 * Create fixture data
 * @param services any additional services that you want to create for your specific fixture
 * @param createDefault Set to false if you don't want the default fixture data to get created
 */
export const createFixture = async (services?: CatalogServiceModel[], createDefault: boolean = true) => {
    const controller = new CatalogServiceController();
    saveDefault = createDefault;
    // save default data
    if (saveDefault) {
        for (const data of mockData) {
            await controller.create(data);
        }
    }
    // save additional data provided
    if (services) {
        additionalData = [...services];
        for (const data of additionalData) {
            await controller.create(data);
        }
    }
};

/**
 * Delete all fixture data
 */
export const deleteFixture = async () => {
    const controller = new CatalogServiceController();
    // delete default fixture data if created
    if (saveDefault) {
        for (const data of mockData) {
            await controller.delete(data);
        }
    }
    // delete additional records provided to the create
    if (additionalData) {
        for (const data of additionalData) {
            await controller.delete(data);
        }
    }
};
