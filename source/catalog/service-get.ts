import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { Config } from '../../config';

import CatalogServiceModel from './model/CatalogServiceModel';

export const main: Handler = async (event: APIGatewayEvent, context: Context, cb: Callback) => {

  try {
    const service = new CatalogServiceModel();
    service.stage = 'dev';
    service.serviceName = 'core-service-tenants';
  
    const mapper = new DataMapper({
      client: new DynamoDB({region: Config.aws_region, endpoint: Config.dynamo_endpoint || null }),
      tableNamePrefix: Config.table_prefix
    });
    await mapper.ensureTableExists(CatalogServiceModel, {readCapacityUnits: 1, writeCapacityUnits: 1});
  
    const newService = await mapper.put(service);
    console.log('Created service: ' + newService.id);
  
    const response = {
      body: JSON.stringify({
        input: event,
        message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!'
      }),
      statusCode: 200
    };
  
    cb(null, response);
  } catch (Error) {
    console.log(Error.message);
    cb(Error, null);
  }
};
