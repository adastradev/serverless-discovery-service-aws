# serverless-discovery-service-aws

[![GitHub license](https://img.shields.io/github/license/adastradev/serverless-discovery-service-aws.svg)](https://github.com/adastradev/serverless-discovery-service-aws/blob/master/LICENSE.md)

*The last serverless micro-service you'll ever wonder how to find*

A Serverless Discovery Service [serverless](serverless.com) micro-service written for AWS using Typescript and DynamoDB that assists with service-discovery in a serverless world. It supports both server (service-to-service) and client-side discovery use cases.

## Usage
See the [serverless-discovery-sdk](https://github.com/adastradev/serverless-discovery-sdk-js.git) project for details on how to start discovering services from other projects; This SDK is planned to be made available in several language bindings.

## Deployment Guide
This project uses a Continuous Deployment pipeline to deploy directly into an AWS account. If desired, forking the repository to a free Bitbucket account is the easiest way to run the pipeline. The pipeline depends on the following environment variables:
* AWS_ACCESS_KEY_ID
* AWS_REGION
* AWS_SECRET_ACCESS_KEY
* AWS_ACCESS_KEY_ID_PROD
* AWS_SECRET_ACCESS_KEY_PROD

## Getting Started - Development / Contributors
Contributions are welcome, as serverless is a new and evolving space. Please let us know if this is valuable to you and feel free to suggest improvements either via issues or pull requests.

### Practices
* The desired nature of this project is to be Civil, Collaborative, and Creative
* Continuous deployment is used for all pull requests -- we ask that all pull requests be in a branch prefixed with `feature/` for Continuous Deployment purposes
* A successful build pipeline run is required for merging pull requests

For development purposes, a deployment of the service can be done as follows

### Prerequisites
```sh
npm install
docker pull dwmkerr/dynamodb
aws configure
```

### Run Integration & System Tests 
```sh
docker run -p 8000:8000 dwmkerr/dynamodb
cp config.ts.sample config.ts
# configure config.ts as desired for either DynamoDBLocal or AWS

# integration tests
npm run test

# system tests
serverless deploy
npm run system-test
```

## Dependencies
* [docker-dynamodb](https://github.com/dwmkerr/docker-dynamodb) - A Local version of DynamoDB used for integration tests / development purposes
* [typescript](https://www.npmjs.com/package/typescript)
* [serverless](serverless.com)
