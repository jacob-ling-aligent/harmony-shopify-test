import * as env from 'env-var';

export const S3_BUCKET_NAME = env.get('s3BucketName').required().asString();
