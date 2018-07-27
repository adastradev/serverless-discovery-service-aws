# Service configuration
sed -e "s|TABLE_PREFIX|$TABLE_PREFIX|" config.ts.sample > config.ts
sed -i -e "s|DYNAMO_ENDPOINT|http://0.0.0.0:8000|" config.ts # Run integration tests against DynamoDB local

npm test
