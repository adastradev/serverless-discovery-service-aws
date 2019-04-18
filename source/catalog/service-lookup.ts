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
        let response;
        if (event.queryStringParameters.Version || event.queryStringParameters.ExternalId) {
            response = await controller.lookupByVersion(event.queryStringParameters.ServiceName,
                event.queryStringParameters.Version || undefined, 
                event.queryStringParameters.ExternalId || undefined);
        } else {
            response = await controller.lookupByStage(event.queryStringParameters.ServiceName,
                event.queryStringParameters.StageName || undefined);
            }
        callback(null, response);
    } catch (Error) {
        console.log(Error.message);
        callback(null, createErrorResponse(501, Error.message));
    }
};
