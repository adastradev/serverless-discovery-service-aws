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
        let response;

        if (params.Version &&
            isRangedVersion(params.Version)
            && isPrereleaseVersion(params.Version)
            && params.Version.indexOf('staging') !== -1) {
            // If a ranged version is passed with a prerelease tag,
            // it will find the latest compatible released version,
            // then circle back and request that version with the given
            // pre-release tag
            const intermediateResponse = await controller.lookupService(params.ServiceName,
                params.Version.split('-')[0],
                params.ExternalID || undefined,
                params.StageName || undefined);

            // Take found prod version, add the postfix
            const foundVersion = JSON.parse(intermediateResponse.body)[0].Version;
            const postfix = params.Version.split('-').slice(1);
            const newVersion = `${foundVersion}-${postfix}`;

            // Make another request with the found version information
            response = await controller.lookupService(params.ServiceName,
                newVersion,
                params.ExternalID || undefined,
                params.StageName || undefined);
        } else {
            response = await controller.lookupService(params.ServiceName,
                params.Version || undefined,
                params.ExternalID || undefined,
                params.StageName || undefined);
        }

        callback(null, response);
    } catch (Error) {
        console.log(Error.message);
        callback(null, createErrorResponse(501, Error.message));
    }
};

export const isRangedVersion = (version) => {
    const regex = /[xX]/g;
    return regex.test(version);
};

export const isPrereleaseVersion = (version) => {
    return version.indexOf('-') >= 0 ? true : false;
};
