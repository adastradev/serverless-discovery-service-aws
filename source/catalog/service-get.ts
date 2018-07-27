import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import CatalogServiceModel from './model/CatalogServiceModel';
import {DataMapper} from '@aws/dynamodb-data-mapper';
import * as DynamoDB from 'aws-sdk/clients/dynamodb';

export const main: Handler = async (event: APIGatewayEvent, context: Context, cb: Callback) => {

  const service = new CatalogServiceModel();
  service.stage = 'dev';
  service.serviceName = 'core-service-tenants';

  const client = new DynamoDB({region: 'us-east-1', endpoint: 'http://0.0.0.0:8000'});
  const mapper = new DataMapper({client});
  await mapper.ensureTableExists(CatalogServiceModel, {readCapacityUnits: 1, writeCapacityUnits: 1})
  await mapper.put({item: service});
  console.log('Created service: ' + service.id);

  const response = {
    body: JSON.stringify({
      input: event,
      message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!'
    }),
    statusCode: 200
  };

  cb(null, response);
};
