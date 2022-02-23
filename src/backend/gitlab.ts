import { Construct } from "constructs";

import { HTTP, Remote } from ".";

import { Client } from "../secrets-manager";

enum Environment {
    Development = "Development",
    QA = "QA",
    Staging = "Staging",
    UAT = "UAT",
    Production = "Production"
}

type Environments = keyof typeof Environment;

interface Input {
    /*** Gitlab Username - Defaults to "NPM-TF-User" */
    readonly Username?: "NPM-TF-User" | string | undefined;

    /*** Gitlab User's API Token - Token must have API Permission */
    readonly Token?: string | undefined;

    /*** Gitlab Server Hostname */
    readonly Hostname?: string | undefined;

    /*** Gitlab Project API Route - Defaults to "api/v4/projects" */
    readonly API?: "api/v4/projects" | string | undefined;

    /*** Gitlab Project State Route - Defaults to "terraform/state" */
    readonly State?: "terraform/state" | string | undefined;
}

interface Defaults {
    lockMethod: "POST";
    unlockMethod: "DELETE";
    skipCertVerification: false;
}

class Gitlab implements Input {
    settings?: Remote;
    environment?: Environments;

    readonly Username: Input["Username"];
    readonly Token: Input["Token"];
    readonly Hostname: Input["Hostname"];
    readonly API: Input["API"];
    readonly State: Input["State"];

    readonly defaults?: Defaults = {
        lockMethod: "POST",
        unlockMethod: "DELETE",
        skipCertVerification: false
    };

    /*** The Magic Constant */
    static readonly secret = "NPM/Development/API-Gateway-Construct/Terraform/HTTP-State";

    /***
     * Initialize HTTP Attribute(s) & Settings
     *
     * @param { Environments } environment
     * @param { number } project
     *
     * @returns {Promise<Gitlab>}
     *
     */

    public static async initialize( environment: Environments, project: number ): Promise<Gitlab> {
        const instance = new Gitlab( await Client.get( Gitlab.secret ) );

        instance.environment = environment;

        instance.settings = instance.backend( project );

        return instance;
    }

    /***
     * The Remote HTTP Backend Construct
     *
     * @param {Construct} scope
     *
     * @returns {HTTP}
     *
     */

    public remote( scope: Construct ): HTTP {
        return new HTTP( scope, {
            address: this?.settings?.address ?? "",
            lockAddress: this?.settings?.lockAddress ?? "",
            lockMethod: this?.settings?.lockMethod ?? "",
            password: this?.settings?.password ?? "",
            skipCertVerification: this?.settings?.skipCertVerification ?? false,
            unlockAddress: this?.settings?.unlockAddress ?? "",
            unlockMethod: this?.settings?.unlockMethod ?? "",
            username: this?.settings?.username ?? ""
        } );
    }

    private constructor( input: JSON | String | Generic | null ) {
        this.Username = input?.Username;
        this.Token = input?.Token;
        this.Hostname = input?.Hostname;
        this.API = input?.API;
        this.State = input?.State;
    }

    /***
     * @param {number} id - Repository or Project ID
     *
     * @returns {Remote}
     *
     */

    private backend( id: number ) {
        return new Remote( {
            ... this.defaults, ... {
                username: this.Username,
                password: this.Token,
                unlockAddress: this.unlock( id ),
                lockAddress: this.lock( id ),
                address: this.address( id )
            }
        } );
    }

    private address( id: number ) {
        return [ "https", "://", this.Hostname, "/", this.API, "/", id, "/", this.State, "/", this.environment ].join( "" );
    }

    private unlock( id: number ) {
        return [ this.address( id ), "/", "lock" ].join( "" );
    }

    private lock( id: number ) {
        return [ this.address( id ), "/", "lock" ].join( "" );
    }
}

type Generic = any;

type VCS = HTTP;

export { Gitlab };

export default Gitlab;

export type { VCS };
