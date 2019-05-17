import { DataMapper } from '@aws/dynamodb-data-mapper';
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { Config } from '../../../config';
import { CatalogServiceModel, TableOptions } from '../model/CatalogServiceModel';
import createErrorResponse from './createErrorResponse';
import * as semver from 'semver';

const NOSTAGE = 'NOSTAGE';

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

            console.log(`Creating service: ${service}`);

            // If external Id is passed, find matching row assuming tenant specific logic is desired.
            if (service.ExternalID) {
                const keyCondition = { ServiceName };
                for await (const item of this.mapper.query(CatalogServiceModel, keyCondition,
                    { indexName: 'ServiceNameIndex' })) {
                    if (service.ExternalID === item.ExternalID) {
                        if (service.Version ? service.Version === item.Version : true) {
                            if (service.StageName ? service.StageName === item.StageName : true) {
                                existingService = item;
                                console.log(`Found existing service for given externalID: ${existingService}`);
                                break;
                            }
                        }
                    }
                }
            // If version is passed, find matching row assuming version specific logic is desired.
            } else if (service.Version) {
                const keyCondition = { ServiceName };
                for await (const item of this.mapper.query(CatalogServiceModel, keyCondition,
                    { indexName: 'ServiceNameIndex' })) {
                    if (service.Version === item.Version && !item.ExternalID) {
                        existingService = item;
                        console.log(`Found service matching given version: ${existingService}`);
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
                    console.log(`Found service matching given name/stage: ${existingService}`);
                    existingService = queryResult.value;
                }
            }

            // if no stage is passed to create, default a value
            if (!service.StageName) {
                console.log(`No stage was passed - defaulting to ${NOSTAGE}`);
                service.StageName = NOSTAGE;
            }

            if (existingService) {
                // TODO: should we consider making this an error condition instead?
                console.log(`Setting new service URL: \n` +
                            `OLD: ${existingService.ServiceURL}\nNEW: ${service.ServiceURL}`);
                existingService.ServiceURL = service.ServiceURL;
                existingService.Version = service.Version;
                const updatedService = await this.mapper.update(existingService);

                console.log(`Updated service: ${updatedService}`);

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
            console.log(`Deleting service: ${service}`);
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
            console.log(`Found service: ${foundService}`);
            return createSuccessResponse(JSON.stringify(foundService));
        } catch (err) {
            console.log(err.message);
            return createErrorResponse(404, err.message);
        }
    }

    public filterServices(Version: string, ExternalID: string, StageName: string, candidates: CatalogServiceModel[]) {
        if (candidates.length < 1) {
            throw new Error('No service candidates provided');
        }

        let filteredCandidates: CatalogServiceModel[];

        // If we're looking for an ExternalID
        if (ExternalID) {
            filteredCandidates = candidates.filter((item) => item.ExternalID === ExternalID);
        }
        // Fallback to services not marked with any ExternalID
        if (!filteredCandidates || filteredCandidates.length < 1) {
            filteredCandidates = candidates.filter((item) => item.ExternalID === undefined);
        }

        // Stages are unique environments and override versions.  A holdover from the old API.  Should be removed later.
        if (StageName) {
            filteredCandidates = filteredCandidates.filter((item) => item.StageName === StageName);
        }

        // At this point, all relevant items should filtered.  If picking by version, choose the latest that matches
        if (Version) {
            // Keep versions that satisfy the passed in Version.
            filteredCandidates = filteredCandidates.filter((item) =>
                (semver.valid(Version) && semver.valid(item.Version) && semver.eq(item.Version, Version))
                || semver.satisfies(item.Version, Version));
        }
        // Sort any that are versioned
        filteredCandidates.sort((a, b) => semver.lt(a.Version || '0.0.0', b.Version || '0.0.0') ? -1 : 1);

        // Last item in filteredCandidates should have the latest version or only valid choice left.
        if (filteredCandidates.length < 1) {
            throw new Error('Failed to find an appropriate service for provided requirements');
        }

        return filteredCandidates.pop();
    }

    public async lookupService(ServiceName: string, Version: string, ExternalID: string, StageName: string) {
        try {
            const candidates: CatalogServiceModel[] = [];
            const keyCondition = { ServiceName };
            for await (const item of this.mapper.query(CatalogServiceModel, keyCondition,
                { indexName: 'ServiceNameIndex' })) {

                // Set stage name to undefined if this entry is NOSTAGE from dynamo.
                //
                // StageName is required to have a value in dynamo to have the record
                // returned using the ServiceNameIndex because StageName is part of the index
                // definition.
                //
                if (item.StageName === NOSTAGE) {
                    item.StageName = undefined;
                }
                candidates.push(item);
            }

            const matches = [this.filterServices(Version, ExternalID, StageName, candidates)];
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
