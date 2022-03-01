import * as OS           from "os";
import * as FS           from "fs";
import * as Path         from "path";
import * as Process      from "process";
import * as Assertion    from "assert";
import * as Cryptography from "crypto";
import * as Subprocess   from "child_process";

import { Construct }                                                   from "constructs";
import { App, TerraformStack, TerraformOutput, TerraformOutputConfig } from "cdktf";
import { Container, ContainerUpload, Image, DockerProvider }           from "@cdktf/provider-docker";

import { Walker } from "./distribution";

const TF = TerraformStack;

interface Data {
    provider: DockerProvider;

    image: Image;

    web: Container;
    api: Container;

    uploads: ContainerUpload[][];

    pwd: string;
    cwd: string;

    package: string;
    build: [string, string];

    target: [string, string];
    artifacts: [string, string];

    walker?: Walker | null;
}

class Stack extends TerraformStack implements Data {
    provider: DockerProvider;

    image: Image;

    web: Container;
    api: Container;

    uploads: ContainerUpload[][];

    pwd: string;
    cwd: string;

    package: string;
    build: [string, string];

    target: [string, string];
    artifacts: [string, string];

    walker?: Walker | null;

    static application: string = Path.join( Path.sep, "application" );

    constructor( scope: Construct, name: string ) {
        super( scope, name );

        this.provider = new DockerProvider( this, "node", {} );

        this.image = new Image( this, "node-image", {
            name: "node:alpine",
            keepLocally: false,
            forceRemove: true
        } );

        this.pwd = Process.cwd();

        this.cwd = Path.dirname( import.meta.url.replace( "file" + ":" + "//", "" ) );
        this.package = Path.dirname( this.cwd );
        this.target = [Path.join( this.package, "front-end" ), Path.join( this.package, "api" )];

        this.build = [Path.join( this.target[0], "build" ), this.target[1]];
        this.artifacts = [Path.join( this.target[0], "artifacts" ), this.target[1]];

        this.uploads = this.distribution();

        this.web = new Container( this, "node-react-container", {
            image: this.image.latest,
            name: "node-react-container",
            logDriver: ( OS.platform() !== "darwin" ) ? "awslogs" : "local",
            logOpts: ( OS.platform() !== "darwin" ) ? {
                logDriver: ( OS.platform() !== "darwin" ) ? "awslogs" : "local",
                "awslogs-region": "us-east-2",
                "awslogs-create-group": "true",
                "awslogs-group": "node-react-container-log-group",
                "awslogs-stream-prefix": "awslogs-example"
            } : {},
            workingDir: [Stack.application, "artifacts"].join(Path.sep),
            upload: this.uploads[0],
            stdinOpen: false,
            tty: false,
            destroyGraceSeconds: 30,
            privileged: true,
            attach: false,
            hostname: "localhost",
            command: [ "npx", "--yes", "serve@latest", "--cors", "--debug", "--no-clipboard", "--listen", "80", "." ],
            ports: [
                {
                    internal: 80,
                    external: 8080,
                    protocol: "tcp",
                    ip: "0.0.0.0"
                }
            ], cpuShares: 256, memory: 512
        } );

        this.api = new Container( this, "node-api-container", {
            image: this.image.latest,
            name: "node-api-container",
            logDriver: ( OS.platform() !== "darwin" ) ? "awslogs" : "local",
            logOpts: ( OS.platform() !== "darwin" ) ? {
                logDriver: ( OS.platform() !== "darwin" ) ? "awslogs" : "local",
                "awslogs-region": "us-east-2",
                "awslogs-create-group": "true",
                "awslogs-group": "node-react-container-log-group",
                "awslogs-stream-prefix": "awslogs-example"
            } : {},
            workingDir: Stack.application,
            upload: this.uploads[1],
            stdinOpen: false,
            tty: false,
            destroyGraceSeconds: 30,
            privileged: true,
            attach: false,
            hostname: "localhost",
            command: [ "npm", "run", "production" ],
            ports: [
                {
                    internal: 3443,
                    external: 3443,
                    protocol: "tcp",
                    ip: "0.0.0.0"
                }
            ], cpuShares: 256, memory: 512
        } );

        new TerraformOutput(this, "node-react-container-logs", {
            description: "Container Log State",
            value: this.web.containerLogs
        });
    }

    /*** Do not pass user-input into shell-related commands */
    compile() {
        Process.chdir( this.target[0] );
        Subprocess.spawnSync( "npm", [ "install" ], { stdio: "pipe", shell: false, encoding: "utf-8" } );
        Subprocess.spawnSync( "npm", [ "run", "build" ], { stdio: "pipe", shell: false, encoding: "utf-8" } );

        Process.chdir(this.target[1]);
        Subprocess.spawnSync( "npm", [ "install" ], { stdio: "pipe", shell: false, encoding: "utf-8" } );
        Subprocess.spawnSync( "npm", [ "run", "build" ], { stdio: "pipe", shell: false, encoding: "utf-8" } );
        Subprocess.spawnSync( "npm", [ "run", "rm-modules" ], { stdio: "pipe", shell: false, encoding: "utf-8" } );
    }

    distribution() {
        this.compile();

        Process.chdir( Path.dirname( this.target[0] ) );
        const web = new Walker( this.target[0], true );
        web.copy( this.build[0], this.artifacts[0] );
        Process.chdir( this.pwd );
        web.accumulate( String( this.artifacts[0] ) );

        Process.chdir( Path.dirname( this.target[1] ) );
        const api = new Walker( this.target[1], true );
        api.copy( this.build[1], this.artifacts[1] );
        Process.chdir( this.pwd );
        api.accumulate( String( this.artifacts[1] ) );

        return this.files(web, api);
    }

    /***
     * Distribution File(s) + Checksum Hashes
     *
     * The following function will iterate all the target files scheduled for
     * upload, take each file's contents and generate a unique checksum using the
     * same hashing algorithm used in `git, and return a docker-compatible, stateful
     * list of Container-Upload types.
     *
     */

    files(webWalker: Walker, apiWalker: Walker) {
        const web: ContainerUpload[] = webWalker.compilations.map( ( $ ) => {
            Assertion.equal( FS.existsSync( String( $ ) ), true );

            const hash = Cryptography.createHash( "sha1" );
            const relative = Path.join( this.target[0] );
            const target = $.replace( relative, Stack.application );

            const buffer = FS.readFileSync( $ );
            hash.update( buffer );
            const checksum = hash.digest().toString( "base64" );

            /// Base64 encoding + SHA-1 is amongst the fastest Hashing + Checksum-Encoding Combinations
            ///  - Sha-1 is also what's used to compute hashes for `git` file commits

            return {
                file: Path.join( target ),
                source: $,
                sourceHash: checksum
            };
        } );

        const api: ContainerUpload[] = apiWalker.compilations.map( ( $ ) => {
            const hash = Cryptography.createHash( "sha1" );
            const relative = Path.join( this.target[1] );
            const target = $.replace( relative, Stack.application );

            const buffer = FS.readFileSync( $ );
            hash.update( buffer );
            const checksum = hash.digest().toString( "base64" );

            /// Base64 encoding + SHA-1 is among the fastest Hashing Combinations
            /// Sha-1 is also what's used to compute hashes for `git` file commits

            Assertion.equal( FS.existsSync( String( $ ) ), true );

            return {
                file: Path.join( target ),
                source: $,
                sourceHash: checksum
            };
        } );

        return [web, api];
    }
}

const mwd = Path.dirname( import.meta.url.replace( "file" + ":" + "//", "" ) );
const pwd = Path.dirname( mwd );

const artifacts = (target: string) => Path.join( pwd, target, "artifacts" );

await Walker.remove( artifacts("front-end"), 5, true, true );

const Application = new App( {
    skipValidation: false,
    stackTraces: true
} );

const Instance = new Stack( Application, "Node-React-Container-Instance" );

Application.synth();

export { TF, Application, Stack, Instance };

export default Instance;