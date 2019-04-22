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

            let existingService;

            // If external Id is passed, find matching row assuming version specific logic is desired.
            if (service.ExternalID) {
                const keyCondition = { ServiceName: service.ServiceName, StageName: 'version-specific' };
                for await (const item of this.mapper.query(CatalogServiceModel, keyCondition,
                    { indexName: 'ServiceNameIndex' })) {

                    let isMatch = false;
                    if (service.ExternalID) {
                        isMatch = service.ExternalID === item.ExternalID;
                    }
                    if (isMatch) {
                        existingService = item;
                        break;
                    }
                    isMatch = false;
                }
            } else if (service.ServiceName && service.StageName) {
                // Look for existing services with the same name and stage
                const keyCondition = { ServiceName: service.ServiceName, StageName: service.StageName };
                const queryIterator = await this.mapper.query(CatalogServiceModel,
                        keyCondition,
                        { indexName: 'ServiceNameIndex' });
                const queryResult = await queryIterator.next();
                if (queryResult) {
                    existingService = queryResult.value;
                }
            }

            if (existingService) {
                // TODO: should we consider making this an error condition instead?
                existingService.ServiceURL = service.ServiceURL;
                existingService.Version = service.Version;
                const updatedService = await this.mapper.update(existingService);
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

    public async lookupByStage(ServiceName, StageName = '') {
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

    public async lookupByVersion(ServiceName, Version, ExternalId) {
        try {
            const matches = [];
            const keyCondition = { ServiceName };
            for await (const item of this.mapper.query(CatalogServiceModel,
                keyCondition,
                { indexName: 'ServiceNameIndex' })) {

                    // TODO: do version check here to see id this item should be returned...
                    /*
                    if (Version) {

                    }
                    */

                    // TODO: do an external Id (tenant-id) check here to see if this item should be returned...
                    /*
                    if (ExternalId) {

                    }
                    */

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
