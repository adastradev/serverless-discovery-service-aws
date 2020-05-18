import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import CatalogServiceController from './catalog/controller/CatalogServiceController';
import createErrorResponse from './catalog/controller/createErrorResponse';
import { withEventDecode } from '@adastradev/astra-aws-sdk';

export const handler: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    try {
        const controller = new CatalogServiceController();
        const response = await controller.provisionTables();
        callback(null, response);
    } catch (Error) {
        console.log(Error.message);
        callback(null, createErrorResponse(501, Error.message));
    }
};

export const main = withEventDecode(handler);
