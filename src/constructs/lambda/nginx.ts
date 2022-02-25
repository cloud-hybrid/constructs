import { ID, AWS, Construct } from ".";

/***
 * @see {@link Type}
 */

interface Input {
}

/***
 * NGINX Container Resource
 *
 * @see {@link Input} for Constructor Usage
 *
 */

class Resource extends Construct {
    public readonly configuration: Input;

    private static readonly defaults: Input = {
        protocol: "http",
        hostname: "localhost",
        ports: {
            internal: 80,
            external: 8080,
            protocol: "tcp",
            ip: "0.0.0.0"
        }
    }

    constructor( scope: Construct, name: string, configuration: Input = Resource.defaults) {
        super( scope, name );

        this.configuration = configuration;
    }
}

export { Resource, Input };

export default Resource;
