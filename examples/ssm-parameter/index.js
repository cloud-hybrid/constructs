import { Stack, Synthesize } from "@cloud-technology/constructs";
class Infrastructure extends Stack {
    constructor(scope, name, settings) {
        super(scope, name, settings);
        //        const bucket = new AWS.s3.S3Bucket( this, "s3-bucket", {
        //            bucket: "testing-cdktf-service-cloud-bucket"
        //        } );
        //
        //        new Resources.Parameter( this, "test-s3-bucket-ssm-parameter", {
        //            type: "String",
        //            value: bucket.arn,
        //            name: "S3-Bucket-ARN",
        //            force: true
        //        } );
    }
}
await Synthesize(Infrastructure);
//# sourceMappingURL=index.js.map