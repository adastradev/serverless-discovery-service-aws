import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

export const main: Handler = async (event: APIGatewayEvent, context: Context, cb: Callback) => {

  try {
    const response = {
      body: JSON.stringify({
        input: event,
        message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!'
      }),
      statusCode: 200
    };

    cb(null, response);
  } catch (Error) {
    console.log(Error.message);
    cb(Error, null);
  }
};
