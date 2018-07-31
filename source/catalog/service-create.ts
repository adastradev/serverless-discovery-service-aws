import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import CatalogServiceModel from './model/CatalogServiceModel';
import CatalogServiceController from './controller/CatalogServiceController';
import createErrorResponse from './controller/createErrorResponse';

export const main: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    try {
        const controller = new CatalogServiceController();
        const json = JSON.parse(event.body);
        const service = Object.assign(new CatalogServiceModel(), json);
        const response = await controller.create(service);
        callback(null, response);
    } catch (Error) {
        console.log(Error.message);
        callback(null, createErrorResponse(501, Error.message));
    }
};
