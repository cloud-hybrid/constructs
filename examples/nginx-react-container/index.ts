import { Stack, Settings, Construct, Synthesize, Resources, Store, State } from "@cloud-technology/constructs";

class Infrastructure extends Stack {
    public readonly state: State;

    constructor( scope: Construct, name: string, settings: Settings) {
        super( scope, name, settings);

        const container = new Resources.NGINX( this, "react" );

        this.state = new Store( this, "demonstration-cdktf-generated-nginx-react-container-url", {
                value: container.url
            }
        );
    }
}

await Synthesize(Infrastructure);
