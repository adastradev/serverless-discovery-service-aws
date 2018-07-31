import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import { CatalogServiceModel } from './model/CatalogServiceModel';
import CatalogServiceController from './controller/CatalogServiceController';
import createErrorResponse from './controller/createErrorResponse';

export const main: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    try {
        const controller = new CatalogServiceController();
        const service = Object.assign(new CatalogServiceModel(), { ServiceID: event.pathParameters.id });
        const response = await controller.delete(service);
        callback(null, response);
    } catch (Error) {
        console.log(Error.message);
        callback(null, createErrorResponse(501, Error.message));
    }
};
