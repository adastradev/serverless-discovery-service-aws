import { DataMapper } from '@aws/dynamodb-data-mapper';
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { Config } from '../../../config';
import { CatalogServiceModel, TableOptions } from '../model/CatalogServiceModel';
import createErrorResponse from './createErrorResponse';

export default class CatalogServiceController {
    private mapper: DataMapper;

    constructor() {
        this.mapper = new DataMapper({
            client: new DynamoDB({region: Config.aws_region, endpoint: Config.dynamo_endpoint || null }),
            tableNamePrefix: Config.table_prefix
        });
    }

    public async provisionTables() {
        try {
            await this.mapper.ensureTableExists(CatalogServiceModel, TableOptions());
            return createSuccessResponse('Tables provisioned successfully', 200);
        } catch (err) {
            console.log(err.message);
            return createErrorResponse(err.statusCode, err.message);
        }
    }

    public async deprovisionTables() {
        try {
            await this.mapper.deleteTable(CatalogServiceModel);
            return createSuccessResponse('Tables de-provisioned successfully', 200);
        } catch (err) {
            console.log(err.message);
            return createErrorResponse(err.statusCode, err.message);
        }
    }

    public async create(service: CatalogServiceModel) {
        try {
            await this.mapper.ensureTableExists(CatalogServiceModel, TableOptions());

            // Look for existing services with the same name and stage
            const keyCondition = { ServiceName: service.ServiceName, StageName: service.StageName };
            const queryIterator = await this.mapper.query(CatalogServiceModel,
                keyCondition,
                { indexName: 'ServiceNameIndex' });
            const existingService = await queryIterator.next();

            if (existingService.value !== undefined) {
                // TODO: should we consider making this an error condition instead?
                existingService.value.ServiceURL = service.ServiceURL;
                const updatedService = await this.mapper.update(existingService.value);
                return createSuccessResponse(JSON.stringify(updatedService), 200);
            } else {
                const newService = await this.mapper.put(service);
                return createSuccessResponse(JSON.stringify(newService), 201);
            }
        } catch (err) {
            console.log(err.message);
            return createErrorResponse(err.statusCode, err.message);
        }
    }

    public async delete(service: CatalogServiceModel) {
        try {
            await this.mapper.delete(service);
            return createSuccessResponse('', 204);
        } catch (err) {
            console.log(err.message);
            return createErrorResponse(err.statusCode, err.message);
        }
    }

    public async get(service: CatalogServiceModel) {
        try {
            const foundService = await this.mapper.get(service);
            return createSuccessResponse(JSON.stringify(foundService));
        } catch (err) {
            console.log(err.message);
            return createErrorResponse(404, err.message);
        }
    }

    public async lookup(ServiceName, StageName = '') {
        try {
            const matches = [];
            const keyCondition = StageName.length === 0 ? { ServiceName } : { ServiceName, StageName };
            for await (const item of this.mapper.query(CatalogServiceModel,
                keyCondition,
                { indexName: 'ServiceNameIndex' })) {
                matches.push(item);
            }
            return createSuccessResponse(JSON.stringify(matches));
        } catch (err) {
            console.log(err.message);
            return createErrorResponse(404, err.message);
        }
    }
}

const createSuccessResponse = (message, statusCode = 200) => {
    return {
        body: message,
        headers: {
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Origin': '*'
        },
        statusCode
    };
};
