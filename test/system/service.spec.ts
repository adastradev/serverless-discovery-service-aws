import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import * as chai from 'chai';
import * as mocha from 'mocha';
import { main } from '../../source/catalog/service-get';
import * as AWS from 'aws-sdk';
import * as DiscoveryServiceSDK from './sdk/DiscoveryServiceSDK';
import { Config } from '../../config';

const expect = chai.expect;
const should = chai.should();

describe('service', () => {
  describe('service', () => {
    let credentials = {
      type: 'None'
    }
    var cloudformationOutput = require('./lib/outputs.json');
    var sdk = new DiscoveryServiceSDK(cloudformationOutput.ServiceEndpoint, Config.aws_region, credentials);

    it('should return Serverless boilerplate message', async () => {
      await sdk.getService();
      console.log('completed HTTP request');
    });

    it('should return Serverless boilerplate message', async () => {
      await sdk.createService();
      console.log('completed HTTP request');
    });
  });
});
