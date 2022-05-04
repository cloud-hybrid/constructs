import { ID, Docker, Construct } from "./index.js";

/***
 * @see {@link Type}
 */

interface Input {
    protocol?: string;
    hostname?: string;
    uploads?: Docker.ContainerUpload[];
    ports: { internal: number, external: number, protocol: string, ip: string };
}

/***
 * NGINX Container Resource
 *
 * @see {@link Input} for Constructor Usage
 *
 */

class Resource extends Construct {
    public readonly url: string;
    public readonly image: Docker.Image;
    public readonly container?: Docker.Container;

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

        new Docker.DockerProvider( scope, "nginx-provider", {} );

        this.image = new Docker.Image( scope, "nginx-image", {
            name: "nginx:latest",
            keepLocally: false,
            forceRemove: true,
            pullTrigger: ""
        } );

        new Docker.Container( scope, "nginx-base-container", {
            name: ID([name,  "nginx-container"]),
            upload: configuration?.uploads,
            destroyGraceSeconds: 30,
            image: this.image.latest,
            stdinOpen: false,
            tty: false,
            privileged: true,
            attach: false,
            hostname: this.configuration.hostname,
            ports: [
                this.configuration.ports
            ], cpuShares: 256, memory: 512
        } );

        this.url = this.configuration.protocol + "://" + this.configuration.hostname + ":" + this.configuration.ports.external;
    }
}

export type { Input };

export { Resource };

export default Resource;
