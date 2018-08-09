const AWS = require('aws-sdk');

async function deploy (data, serverless, options) {
    var provisionerArn = data.DbDashprovisionLambdaFunctionQualifiedArn;
    console.log('Provisioning DynamoDB tables using lambda: ', provisionerArn);
    let lambda = new AWS.Lambda({ region: serverless.getProvider('aws').options.region });
    await lambda.invoke({ FunctionName: provisionerArn }).promise();
    console.log('Finished provisioning DynamoDB tables');
}

async function remove (data, serverless, options) {
    var teardownArn = data.DbDashdeprovisionLambdaFunctionQualifiedArn;
    console.log('Provisioning DynamoDB tables using lambda: ', teardownArn);
    let lambda = new AWS.Lambda({ region: serverless.getProvider('aws').options.region });
    await lambda.invoke({ FunctionName: teardownArn }).promise();
    console.log('Finished deprovisioning DynamoDB tables');
}

module.exports = { deploy, remove };
