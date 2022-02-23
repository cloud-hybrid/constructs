import { Stack, Settings, Construct, State, Synthesize, Resources, AWS, Store } from "@cloud-technology/constructs";

class Infrastructure extends Stack {
    constructor( scope: Construct, name: string, settings: Settings ) {
        super( scope, name, settings );

        const bucket = new AWS.s3.S3Bucket( this, "demonstration-cdktf-generated-s3-bucket", {
            bucket: "demonstration-cdktf-generated-bucket"
        } );

        const state: State = new Store( this, "demonstration-cdktf-generated-s3-bucket-state", {
            value: bucket
        } );

        ( process.env?.debug ) && console.log( state );
    }
}

await Synthesize( Infrastructure );
