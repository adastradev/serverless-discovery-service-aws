import { DataMapper } from '@aws/dynamodb-data-mapper';
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { Config } from '../../../config';
import CatalogServiceModel from "../model/CatalogServiceModel";

export default class CatalogServiceController {
    constructor() {
    }

    async create(service: CatalogServiceModel) {
        try {
            const mapper = new DataMapper({
                client: new DynamoDB({region: Config.aws_region, endpoint: Config.dynamo_endpoint || null }),
                tableNamePrefix: Config.table_prefix
              });
              await mapper.ensureTableExists(CatalogServiceModel, {readCapacityUnits: 1, writeCapacityUnits: 1});
            
              const newService = await mapper.put(service);          
            return createSuccessResponse(JSON.stringify(newService));
        }
        catch (err) {
            console.log(err.message);
            return createErrorResponse(err.statusCode, err.message); 
        }
    }

    async find(service: CatalogServiceModel) {
        try {
            // var params = {
            //     id: tenant.id
            // };

            // var foundTenant = await this.dynamoHelper.getItem(params, credentials);
            // if (foundTenant) {
            //     var tranformer = new TenantModelTransformer();                
            //     return createSuccessResponse(JSON.stringify({ tenant: tranformer.fromDynamoModel(foundTenant) }));
            // }
            // else {
                return createErrorResponse(404, 'Incorrect id');
            // }
        }
        catch (err) {
            console.log(err.message);
            return createErrorResponse(err.statusCode, err.message);
        }
    }
}

let createSuccessResponse = (message, statusCode = 200) => {
    return {
        statusCode: statusCode,
        body: message
    };
};

let createErrorResponse = (statusCode, message) => {
    return {
        statusCode: statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: message || 'Incorrect id'
    };
};
