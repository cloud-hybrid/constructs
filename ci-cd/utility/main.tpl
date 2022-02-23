/***
 * Deployable IaC Entry Point
 * ---
 *
 * @internal
 *
 * @example
 * import { Stack, Settings, Construct, State, Synthesize, Resources, AWS, Store } from "@cloud-technology/constructs";
 *
 * class Infrastructure extends Stack {
 *     constructor( scope: Construct, name: string, settings: Settings) {
 *         super( scope, name, settings);
 *
 *         const bucket = new AWS.s3.S3Bucket( this, "s3-bucket", {
 *             bucket: "demonstration-cdktf-generated-bucket"
 *         } );
 *
 *         const state: State = new Store(this, "demonstration-cdktf-generated-bucket-state", {
 *             value: bucket
 *         });
 *
 *         (process.env?.debug) && console.log(state);
 *     }
 * }
 *
 * await Synthesize(Infrastructure);
 *
*/

import { Stack, Settings, Construct, State, Synthesize, Resources, AWS, Store } from "@cloud-technology/constructs";

class Infrastructure extends Stack {
    constructor( scope: Construct, name: string, settings: Settings) {
        super( scope, name, settings);
    }
}

await Synthesize(Infrastructure);

export { Infrastructure };

export default Infrastructure;