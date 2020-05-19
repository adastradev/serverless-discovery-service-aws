import Log from '@adastradev/astra-logger';
import { APIGatewayEvent, Context } from 'aws-lambda';
import { CatalogServiceModel } from './model/CatalogServiceModel';
import CatalogServiceController from './controller/CatalogServiceController';
import createErrorResponse from './controller/createErrorResponse';
import { AsyncApiHandler, withEventDecode } from '@adastradev/astra-aws-sdk';

const handler: AsyncApiHandler = async (event: APIGatewayEvent, context: Context) => {
    try {
        Log.config({ tenant_id: 'Discovery Service' });
        const controller = new CatalogServiceController();
        const json = JSON.parse(event.body);
        const service = Object.assign(new CatalogServiceModel(), json);
        const response = await controller.create(service);
        return response;
    } catch (Error) {
        Log.error(Error.message, Error.stack);
        return createErrorResponse(501, Error.message);
    }
};

export const main = withEventDecode(handler);
