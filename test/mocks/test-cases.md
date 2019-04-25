# Test cases for discovery service API

The file `./mockdata.ts` represents the different scenarios that are to be supported by the discovery service. Here is a list of the current data set

| ServiceName | StageName | ExternalID | Version | URL |
|-------------|-----------|------------|---------|-----|
| TestCourse  | dev       |            |         |URL1 |
| TestCourse  | staging   |            |         |URL2 |
| TestCourse  | prod      |            |         |URL3 |
| TestTerm    | dev       |            |         |URL4 |
| TestTerm    | staging   |            |         |URL5 |
| TestTerm    | prod      |            |         |URL6 |
| TestCampus  | dev       |            |         |URL7 |
| TestCampus  | staging   |            |         |URL8 |
| TestCampus  | prod      |            |         |URL9 |
| TestTerm    | dev       |Tenant1     |1.0.1    |URL10|
| TestTerm    | dev       |Tenant1     |1.1.2    |URL11|
| TestTerm    | dev       |Tenant1     |2.0.1    |URL12|
| TestCourse  | dev       |Tenant1     |1.5.1    |URL13|
| TestCourse  | dev       |Tenant2     |1.6.1    |URL14|
| TestCourse  | prod      |Tenant2     |1.6.1    |URL15|
| TestCampus  |           |            |2.6.1    |URL16|
| TestCampus  |           |            |2.6.2    |URL17|
| TestTerm    |           |            |2.0.0    |URL18|

As a user, I would like the discovery service to:

## Scenario 1: Return the right URL for a given service name and stage name

    WHEN a servcice name and stage name is passed to the API
    THEN it should return the right URL

*Test case:* {TestCourse, dev} => URL1 

## Scenario 2: Return the right URL for a given service name and stage name and tenant ID

    WHEN a servcice name, stage name and tenant ID is passed to the API
    THEN it should return the right URL
    
*Test case:* {TestCourse, dev, Tenant2} => URL14

*Test case:* {TestCourse, prod, Tenant2} => URL15

## Scenario 3: If there are multiple entries for a tenant, return the right URL

    WHEN a servcice name, stage name and tenant ID is passed to the API
    AND there are multiple versions available for the tenant
    THEN it should return the URL for the highest version
    
*Test case:* {TestTerm, dev, Tenant1} => URL12

## Scenario 4: Use semver to determine the highest version

    WHEN a servcice name, stage name, tenant ID and version is passed to the API
    AND there are multiple versions available for the tenant
    THEN it should return the URL for the highest version
    
*Test case:* {TestTerm, dev, Tenant1, 1} => URL11

## Scenario 5: Return the version that is specified

    WHEN a servcice name, stage name, tenant ID and version is passed to the API
    AND the specified version is available
    THEN return the specified version
    
*Test case:* {TestTerm, dev, Tenant1, 1.0.1} => URL10


## Scenario 6: Return the default URL when there is no entry for a tenant

    WHEN a servcice name, stage name and tenant ID is passed to the API
    AND there is no entry for the tenant
    THEN return the default URL
    
*Test case:* {TestTerm, dev, Tenant3} => URL4

## Scenario 7: Throw error if invalid version is specified

    WHEN service name and specific version is provided to the API
    AND no compatible version is available
    THEN it should throw error
    
*Test case:* {TestCampus, 3} => **ERROR**

## Scenario 8: Throw an error if a invalid stage is provided

    WHEN an invalid stage is provided to the API
    THEN it should return a 404 error
    
*Test case:* {TestTerm, invalid_stage, Tenant1} => **ERROR**

*Test case:* {TestTerm, invalid_stage} => **ERROR**

## Scenario 9: If only service name is provided, return latest non-stage version available

    WHEN only service name is provided to the API
    THEN it should provide highest non-stage, non-tenant version
    
*Test case:* {TestTerm} => URL18

## Scenario 10: Throw an error if a invalid service name is provided

    WHEN an invalid service name is provided to the API
    THEN it should return a 404 error
    
*Test case:* {invalid_service, dev} => **ERROR**

*Test case:* {invalid_service, dev, Tenant1} => **ERROR**

## Scenario 11: Use semver to determine the version, when no stage is passed

    WHEN service name and version is provided to the API
    THEN it should return the url for the highest version
    
*Test case:* {TestCampus, 2} => URL17

## Scenario 12: Should be able to return a specific version if present

    WHEN service name and specific version is provided to the API
    THEN it should return the url for the given version
    
*Test case:* {TestCampus, 2.6.1} => URL16



