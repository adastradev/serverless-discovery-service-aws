import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import CatalogServiceController from './controller/CatalogServiceController';
import createErrorResponse from './controller/createErrorResponse';

export const main: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    try {
        if (event.queryStringParameters.ServiceName === undefined) {
            callback(null, createErrorResponse(400, 'Bad request'));
            return;
        }
        const controller = new CatalogServiceController();
        const params = event.queryStringParameters;
        const response = await controller.lookupService(params.ServiceName,
            params.Version || undefined,
            params.ExternalID || undefined,
            params.StageName || undefined);
        callback(null, response);
    } catch (Error) {
        console.log(Error.message);
        callback(null, createErrorResponse(501, Error.message));
    }
};
