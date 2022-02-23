import Path    from "path";
import Module  from "module";
import Process from "process";

import { Parameter } from "@cloud-technology/parameter";

import { AWS, Base, Construct, ID, Output, State, Store } from ".";

/***
 * SSM Parameter Configuration Settings
 *
 * @example
 * interface Input {
 *     name: string;
 *     force?: boolean;
 *     type: "String" | "SecretString";
 *     value: string;
 * }
 *
 */

interface Input {
    /*** SSM Parameter Name */
    name: string;

    /*** Force Overwrite of SSM Parameter */
    force?: boolean;

    /*** SSM Parameter Data-Type */
    type: "String" | "StringList" | "SecureString";

    /*** Stored SSM Parameter Value */
    value: string;
}

/*** Cloud Resource Type Reference */
type Type = AWS.ssm.SsmParameter;

/*** Cloud Resource Input Configuration Reference  */
type Configuration = AWS.ssm.SsmParameterConfig;

/*** Cloud Resource Class | Constructor Alias */
const Reference = AWS.ssm.SsmParameter;

/***
 * SSM Parameter Resource
 *
 * @see {@link Input} for Constructor Usage
 *
 */

class Resource extends Construct implements Base {
    private readonly scope: Construct;
    private readonly identifier: string;

    private static service = "SSM";
    private static resource = "Parameter";

    private static readonly identifier = [ Resource.service, Resource.resource ].join( "-" );

    /*** The Globally Defined Resource Type */
    readonly instance: Type;

    /*** Infrastructure Stateful Export(s) */
    public readonly state: {
        identifier: State,
        name: State,
        value: State
    } = { identifier: null, name: null, value: null };

    /***
     * @example
     * import { Application, TF, Construct, Configuration, ID, Initialize, Initializer } from "./configuration";
     * import { Resource as Parameter } from "./constructs/ssm-parameter";
     *
     * class Stack extends TF {
     *     configuration: Configuration;
     *
     *     parameter: Parameter;
     *
     *     constructor( scope: Construct, name: string, settings: Initializer ) {
     *         super( scope, ID( name ) );
     *
     *         this.configuration = settings( this, name );
     *
     *         this.parameter = new Parameter( scope, name, {
     *             type: "SecretString",
     *             value: JSON.stringify( { User: "Username", Password: "S3creT123!" } ),
     *             name: "/Organization/Development/Proof-of-Concept/Test-Service/Credentials",
     *             force: true
     *         } );
     *
     *     }
     * }
     *
     * @param {Construct} scope
     * @param {string} name
     * @param {Input} input
     *
     */
    constructor( scope: Construct, name: string, input: Input ) {
        super( scope, ID( [ name, Resource.identifier ].join( "-" ) ) );

        this.scope = scope;

        const $ = input.name.split( "/" );

        const type: { parameter: Parameter | null } = { parameter: null };
        const importer = Module.createRequire( import.meta.url );
        const tags = importer( Path.join( Process.cwd(), "configuration.json" ) );

        try {
            type.parameter = Parameter.initialize( input.name );
        } catch ( error ) {
            if ( $.length === 1 ) {
                const organization = tags.organization;
                const environment = tags.environment;
                const service = tags.service;

                const name = [ "", organization, environment, service, input.name ].join( "/" );

                type.parameter = Parameter.initialize( name );
            } else {
                throw error;
            }
        }

        /// Experimental Block -- Subject to Change
        type.parameter.organization = tags.organization;
        type.parameter.environment = tags.environment;
        type.parameter.service = tags.service;

        input.name = type.parameter.string( "Directory", "/" );

        this.identifier = ID( type.parameter.string( "Train-Case" ) );
        this.instance = Resource.type( scope, this.identifier, input );

        this.state.identifier = this.stateful("ARN", this.instance.arn, "Resource Identifier");
        this.state.name = this.stateful("Name", this.instance.name, "Resource Name" );
        this.state.value = this.stateful("Value", this.instance.value, "Resource Value(s)", true);
    }

    private stateful (attribute: string, value: any, description: string, sensitive: boolean = false) {
        return Resource.output( this.scope, ID( [ this.identifier, attribute ].join( "-" ) ), {
            value, description, sensitive
        } );
    }

    /***
     * Constructor Remapping Configuration
     *
     * @param {Construct} scope
     * @param {string} id
     * @param {Input} configuration
     *
     * @returns {Type}
     *
     * @private
     *
     */

    private static type( scope: Construct, id: string, configuration: Input ): Type {
        const settings = Resource.mapping( configuration );

        return new Reference( scope, id, { ... settings } );
    }

    /***
     * Input => Input-Type Mapping
     * ---
     *
     * The value of the following utility function is threefold:
     * - Overloading
     * - Opinionated Default(s)
     * - Strictly Enforced Configuration
     *
     * The structure of the return hashable should be as follows:
     *
     * 1. Strictly Enforced Configuration
     * 2. Opinionated Default(s)
     * 3. User Configuration
     * 4. Overloads
     *
     * ---
     *
     * @example
     * /// Arbitrary Cloud Resource Mapping
     * function $(configuration, parameters = {}) {
     *     return {
     *         ... {
     *             // --> Enforcement
     *             secret: true, // (Hard-Coded Assignment)
     *
     *             // --> Opinionated Default(s)
     *             notifications: configuration?.optional ?? true // (`?` Guarding)
     *
     *             // --> User Configuration
     *             identifier: configuration.id // (Object Indexing)
     *
     *             // --> Overloads, Escape Hatches
     *         }, ... parameters // (Unpacking)
     *     };
     * }
     *
     * @param {Input} configuration
     * @param {Configuration | {}} parameters
     *
     * @returns {Configuration}
     *
     * @private
     *
     */

    private static mapping( configuration: Input, parameters: Configuration | {} = {} ): Configuration {
        return {
            ... {
                dataType: "text",
                overwrite: configuration?.force ?? false,
                name: configuration.name,
                type: configuration.type,
                value: configuration.value
            }, ... parameters
        };
    }

    /***
     * Static Utility Wrapper for CDKTF Stack Output
     *
     * @param {Construct} scope
     * @param {string} id
     * @param {Output} settings
     *
     * @returns {State}
     *
     * @private
     *
     */

    private static output( scope: Construct, id: string, settings: Output ): State {
        return new Store( scope, id, settings );
    }
}

export { Resource, Input };

export default Resource;
