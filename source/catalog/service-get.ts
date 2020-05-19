import Log from '@adastradev/astra-logger';
import { APIGatewayEvent, Context } from 'aws-lambda';
import { CatalogServiceModel } from './model/CatalogServiceModel';
import CatalogServiceController from './controller/CatalogServiceController';
import createErrorResponse from './controller/createErrorResponse';
import { AsyncApiHandler, withEventDecodeAsync } from '@adastradev/astra-aws-sdk';

const handler: AsyncApiHandler = async (event: APIGatewayEvent, context: Context) => {
    try {
        Log.config({ tenant_id: 'Discovery Service' });
        const controller = new CatalogServiceController();
        const service = Object.assign(new CatalogServiceModel(), { ServiceID: event.pathParameters.id });
        const response = await controller.get(service);
        return response;
    } catch (Error) {
        Log.error(Error.message, Error.stack);
        return createErrorResponse(501, Error.message);
    }
};

export const main = withEventDecodeAsync(handler);
