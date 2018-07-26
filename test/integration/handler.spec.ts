import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import * as chai from 'chai';
import * as mocha from 'mocha';
import { hello } from '../../source/handler';

const expect = chai.expect;
const should = chai.should();

describe('handler', () => {
  describe('hello', () => {
    it('should return Serverless boilerplate message', () => {
      hello(null, null, (error: Error, result: any) => {
        // tslint:disable
        expect(error).to.be.null;
        result.body.should.equal('{"input":null,"message":"Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!"}');
        // tslint:enable
      });
    });
  });
});
