sed -e "s|TABLE_PREFIX|$TABLE_PREFIX|" config.ts.sample > config.ts
sed -i -e "s|DYNAMO_ENDPOINT||" config.ts # Run system tests against cloud DynamoDB

npm run-script deploy -- --stage $STAGE_NAME
