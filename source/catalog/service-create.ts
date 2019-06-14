import Log from '@adastradev/astra-logger';
import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import { CatalogServiceModel } from './model/CatalogServiceModel';
import CatalogServiceController from './controller/CatalogServiceController';
import createErrorResponse from './controller/createErrorResponse';

export const main: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    try {
        Log.config({ tenant_id: 'Discovery Service' });
        const controller = new CatalogServiceController();
        const json = JSON.parse(event.body);
        const service = Object.assign(new CatalogServiceModel(), json);
        const response = await controller.create(service);
        callback(null, response);
    } catch (Error) {
        Log.error(Error.message, Error.stack);
        callback(null, createErrorResponse(501, Error.message));
    }
};
