import { Stack, Settings, Construct, State, Synthesize, Resources, AWS, Store } from "@cloud-technology/constructs";

class Infrastructure extends Stack {
    constructor( scope: Construct, name: string, settings: Settings ) {
        super( scope, name, settings );

        const parameter = new AWS.s3.S3Bucket( this, "demonstration-cdktf-generated-ssm-parameter", {
            dataType: "text",
            overwrite: true,
            name: "/Organization/Development/CDK-TF/Example/Value",
            type: "String",
            value: "Value"
        } );

        const state: State = new Store( this, "demonstration-cdktf-generated-ssm-parameter-state", {
            value: parameter
        } );

        ( process.env?.debug ) && console.log( state );
    }
}

await Synthesize( Infrastructure );
