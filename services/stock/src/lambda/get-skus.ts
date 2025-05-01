/* v8 ignore start */
// You can deconstruct modules to import a specific type
// AWSLambda.Handler provides generic typing
// for handler functions. Specific argument and output
// types can be supplied using generic arguments
// e.g. AWSLambda.Handler<string, object>, or you can use
// event-specific handler types e.g. AWSLambda.S3Handler
import { GetObjectCommand } from '@aws-sdk/client-s3';
import type { Handler } from 'aws-lambda/handler';

export const handler: Handler = async (event, context) => {
  const message = 'World';
  console.log(`Fetching`);
  // Cloudwatch logs display objects more cleanly if
  // they are sent as JSON strings
  console.log('Lambda event: ', JSON.stringify(event));
  console.log('Lambda context: ', JSON.stringify(context));
  return {};
};

async function getFromS3(bucket: string, key: string): Promise<unknown> {
  const client = new S3Client({});
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  try {
    console.log(
      `Fetching data to process from S3 bucket: ${bucket} and key: ${key}`
    );
    const response = await client.send(command);
    console.log(`S3 response: ${response}`);
    return {
      response
    };
  } catch (e) {
    console.error(`S3 errored on upload: ${e}`);
  }
  return { success: true };
}
