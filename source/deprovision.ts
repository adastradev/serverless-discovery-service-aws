import { APIGatewayEvent, Context } from 'aws-lambda';
import CatalogServiceController from './catalog/controller/CatalogServiceController';
import createErrorResponse from './catalog/controller/createErrorResponse';
import { AsyncApiHandler, withEventDecodeAsync } from '@adastradev/astra-aws-sdk';

export const handler: AsyncApiHandler = async (event: APIGatewayEvent, context: Context) => {
    try {
        const controller = new CatalogServiceController();
        const response = await controller.deprovisionTables();
        return response;
    } catch (Error) {
        console.log(Error.message);
        return createErrorResponse(501, Error.message);
    }
};

export const main = withEventDecodeAsync(handler);
