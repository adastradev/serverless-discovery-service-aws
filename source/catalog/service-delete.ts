import Log from '@adastradev/astra-logger';
import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import { CatalogServiceModel } from './model/CatalogServiceModel';
import CatalogServiceController from './controller/CatalogServiceController';
import createErrorResponse from './controller/createErrorResponse';

export const main: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    try {
        Log.config({ tenant_id: 'Discovery Service' });
        const controller = new CatalogServiceController();
        const service = Object.assign(new CatalogServiceModel(), { ServiceID: event.pathParameters.id });
        const response = await controller.delete(service);
        callback(null, response);
    } catch (Error) {
        Log.error(Error.message, Error.stack);
        callback(null, createErrorResponse(501, Error.message));
    }
};
