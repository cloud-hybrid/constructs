import { S3Bucket, S3BucketObject, S3BucketPolicy } from "@cdktf/provider-aws/lib/s3";
import { Resource }                                 from "@cdktf/provider-null/lib/resource";
import { TerraformAsset } from "cdktf";
import { Construct }      from "constructs";

import Glob from "glob";
import Path from "path";
import Mime from "mime-types";

class Storage extends Resource {
    bucket: S3Bucket;

    constructor(scope: Construct, name: string, absoluteContentPath: string) {
        super(scope, name);
        const { path: contentPath, assetHash: contentHash } = new TerraformAsset(
            this,
            `context`,
            {
                path: absoluteContentPath,
            }
        );

        // create bucket with website delivery enabled
        this.bucket = new S3Bucket(this, `bucket`, {
            bucketPrefix: `${name}`,

            website: {
                indexDocument: "index.html",
                errorDocument: "index.html", // we could put a static error page here
            }
        });

        // Get all build files synchronously
        const files = Glob.sync("**/*.{json,js,html,png,ico,txt,map,css}", {
            cwd: absoluteContentPath,
        });

        files.forEach((f) => {
            // Construct the local path to the file
            const filePath = Path.join(contentPath, f);

            // Creates all the files in the bucket
            new S3BucketObject(this, `${name}/${f}/${contentHash}`, {
                bucket: this.bucket.id,
                key: f,
                source: filePath,
                // mime is an open source node.js tool to get mime types per extension
                contentType: Mime.contentType(Path.extname(f)) || "text/html",
                etag: `filemd5("${filePath}")`,
            });
        });

        // allow read access to all elements within the S3Bucket
        new S3BucketPolicy(this, `s3-policy`, {
            bucket: this.bucket.id,
            policy: JSON.stringify({
                Version: "2012-10-17",
                Id: `${name}-public-website`,
                Statement: [
                    {
                        Sid: "PublicRead",
                        Effect: "Allow",
                        Principal: "*",
                        Action: ["s3:GetObject"],
                        Resource: [`${this.bucket.arn}/*`, `${this.bucket.arn}`],
                    },
                ],
            }),
        });
    }

    get websiteEndpoint() {
        return this.bucket.websiteEndpoint;
    }
}

export { Storage };

export default Storage;