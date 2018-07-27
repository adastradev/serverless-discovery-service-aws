import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import CatalogServiceModel from './model/CatalogServiceModel';

export const main: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {

  const model = new CatalogServiceModel();

  const response = {
    body: JSON.stringify({
      input: event,
      message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!'
    }),
    statusCode: 200
  };

  cb(null, response);
};
