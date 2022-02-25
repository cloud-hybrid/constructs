import Path    from "path";
import Module  from "module";
import Process from "process";

import { AWS } from ".";

import { Construct } from "constructs";

import { App, TerraformStack, TerraformOutput } from "cdktf";

import { ID }                       from "./utility";
import { Gitlab, VCS }              from "./backend/gitlab";
import { Tags, Tagging, Input } from "./tags";
import { Credentials, Credential }  from "./credentials";
import * as UUID from "uuid"

const $ = Path.dirname(Process.cwd());
const Import = Module.createRequire( $ );

class Configuration extends Construct {
    /***
     * A Boolean representing the current runtime environment's interactive IO device(s).
     *
     * Note that during a ci-cd build, or pipeline, a prompt from the user to provide
     * input, or to update configurations, isn't applicable. The following static property
     * provides a means for quickly validating runtime logic if or if not the user
     * can change configuration(s).
     *
     * @type {boolean}
     *
     */
    public static readonly ci: boolean = (!process.stdout.isTTY && (process.env?.ci !== "true" ?? false));

    /***
     * Common tag identifiers that are propagated throughout all the resources
     * in a composed stack(s).
     *
     * @type {Tagging}
     *
     */
    public readonly identifiers: Tagging;

    /*** The Stateful Cloud Provider */
    public readonly provider: AWS.AwsProvider;

    /*** Shared Credentials File Location - Defaults to "~/.aws/credentials" */
    public readonly credentials: string;
    /*** Credentials Profile Alias - Defaults to "default" */
    public readonly profile: string;
    /*** AWS Account Region - Derives from Initial Configuration */
    public readonly region: string;

    public readonly name: string;

    /*** The Remote State Backend Type - A Construct Wrapper */
    /// readonly backend: Gitlab;

    /*** The Remote State Backend - Used to Track Infrastructure State Across Team(s) & Organizations */
    /// readonly remote: VCS;

    constructor( scope: Construct, name: string, identifiers: Tagging, /* backend: Gitlab */ credentials: Credential = Credentials ) {
        super( scope, ID( [ name, "Configuration", UUID.v4() ].join( "-" ) ) );

        this.name = name;
        this.identifiers = identifiers;

        this.region = credentials.region;
        this.profile = credentials.profile;
        this.credentials = credentials.credentials;

        /// this.backend = backend;
        /// this.remote = backend.remote( scope );

        this.provider = new AWS.AwsProvider( scope, ID( [ name, "Configuration", "Provider" ].join( "-" ) ), {
            region: this.region,
            profile: this.profile,
            defaultTags: this.identifiers,
            sharedCredentialsFile: this.credentials
        } );
    }

    public static tags( input: Input ) {
        return Tags.initialize( input );
    }
}

/***
 * Primary Application Entry-Point
 * ---
 *
 * Initializes the Deployable from Configuration + Opinionated Default(s)
 *
 * @returns {Promise<(scope: Construct) => Configuration>}
 *
 * @constructor
 *
 */
const Initialize = async function (path: string = Path.join(Process.cwd(), "configuration.json")) {
    const Settings = Import(path);

    const tags = Configuration.tags( {
        tf: Settings.tf,
        cfn: Settings.cfn,
        cloud: Settings.cloud,
        service: Settings.service,
        creator: Settings.creator,
        environment: Settings.environment,
        organization: Settings.organization
    } as Input );

    /// const backend = await Gitlab.initialize( environment as "Development" | "QA" | "Staging" | "UAT" | "Production", 0 );

    /// Overload the Function `Initialize`'s prototype and set `settings` === `tags.json` configuration.

    Reflect.set( Initialize, "settings", Settings );

    return ( scope: Construct, name: string ) => new Configuration( scope, name, tags, /* backend, Credentials */ );
};

const Application = App;

const TF = TerraformStack;

export { AWS, Application, TF, ID, Initialize, Configuration, Construct };

export default Initialize;
