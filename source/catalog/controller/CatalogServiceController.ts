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
            const ServiceName = service.ServiceName;

            // If external Id is passed, find matching row assuming tenant specific logic is desired.
            if (service.ExternalID) {
                const keyCondition = { ServiceName };
                for await (const item of this.mapper.query(CatalogServiceModel, keyCondition,
                    { indexName: 'ServiceNameIndex' })) {
                    if (service.ExternalID === item.ExternalID) {
                        existingService = item;
                        break;
                    }
                }
            // If version is passed, find matching row assuming version specific logic is desired.
            } else if (service.Version) {
                const keyCondition = { ServiceName };
                for await (const item of this.mapper.query(CatalogServiceModel, keyCondition,
                    { indexName: 'ServiceNameIndex' })) {
                    if (service.Version === item.Version && !item.ExternalID) {
                        existingService = item;
                        break;
                    }
                }
            // Look for existing services with the same name and stage (v1 functionality)
            } else if (service.ServiceName && service.StageName) {
                const keyCondition = { ServiceName: service.ServiceName, StageName: service.StageName };
                const queryIterator = await this.mapper.query(CatalogServiceModel, keyCondition,
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

    public async lookupByVersion(ServiceName, Version, ExternalId, StageName) {
        try {
            const matches = [];
            const keyCondition = { ServiceName };
            for await (const item of this.mapper.query(CatalogServiceModel,
                keyCondition,
                { indexName: 'ServiceNameIndex' })) {

                    let isMatch = false;

                    // Do an external Id (tenant-id) check here to see if this item should be returned.
                    if (ExternalId && item.ExternalID === ExternalId) {
                        isMatch = true;
                    // Do version check here to see id this item should be returned.
                    } else if (Version && item.Version === Version  && !item.ExternalID) {
                        isMatch = true;
                    // Do stage check here to see id this item should be returned.
                    } else if (StageName && item.StageName === StageName  && !item.ExternalID) {
                        isMatch = true;
                    }

                    if (isMatch) {
                        matches.push(item);
                    }
                    isMatch = false;
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
