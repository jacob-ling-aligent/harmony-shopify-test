/* v8 ignore start */
import { responseXml } from '../../tests/__data__/example-data';
import {
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from '@aws-sdk/client-s3';

// You can deconstruct modules to import a specific type
// AWSLambda.Handler provides generic typing
// for handler functions. Specific argument and output
// types can be supplied using generic arguments
// e.g. AWSLambda.Handler<string, object>, or you can use
// event-specific handler types e.g. AWSLambda.S3Handler
import type { Handler } from 'aws-lambda/handler';

export const handler: Handler = async (event, context) => {
  console.log(`Getting product updates...`);
  // Cloudwatch logs display objects more cleanly if
  // they are sent as JSON strings
  console.log('Lambda event: ', JSON.stringify(event));
  console.log('Lambda context: ', JSON.stringify(context));
  const key = await upload(JSON.stringify(responseXml));
  return {
    status: 'Success',
    statusCode: 200,
    s3Key: key,
  };
};

async function upload(bucket: string, blob: unknown): Promise<string> {
  const key = `updates-${crypto.randomUUID()}`;
  const client = new S3Client({});
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: blob,
  });

  try {
    const response = await client.send(command);
    console.log(`S3 response: ${response}`);
  } catch (e) {
    console.error(`S3 errored on upload: ${e}`);
  }
  return key;
}
