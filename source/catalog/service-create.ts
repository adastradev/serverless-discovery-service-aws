import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import CatalogServiceModel from './model/CatalogServiceModel';
import CatalogServiceController from './controller/CatalogServiceController';

export const main: Handler = async (event: APIGatewayEvent, context: Context, cb: Callback) => {

  try {
    const service = new CatalogServiceModel();
    service.StageName = 'dev';
    service.ServiceName = 'core-service-tenants';

    const controller = new CatalogServiceController();
    const response = await controller.create(service);
    cb(null, response);  
  } catch (Error) {
    console.log(Error.message);
    cb(Error, null);
  }
};
