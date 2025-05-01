/* v8 ignore start */
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import type { Handler } from 'aws-lambda/handler';
import { parseString } from 'xml2js';
import { responseXml } from '../../tests/__data__/example-data';
import { S3_BUCKET_NAME } from '../env/aws';

export const handler: Handler = async (event, context) => {
  console.log(`Getting product updates...`);
  // Cloudwatch logs display objects more cleanly if
  // they are sent as JSON strings
  console.log('Lambda event: ', JSON.stringify(event));
  console.log('Lambda context: ', JSON.stringify(context));
  const key = await upload(
    S3_BUCKET_NAME,
    JSON.parse(parseString(JSON.stringify(responseXml)))
  );
  return {
    success: true,
    statusCode: 200,
    s3Key: key,
  };
};

async function upload(bucket: string, blob: string): Promise<string> {
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
