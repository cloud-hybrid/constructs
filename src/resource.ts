import { Construct } from "constructs";

import { TerraformOutput, TerraformOutputConfig } from "cdktf";

const Store = TerraformOutput;

import { Configuration } from "./configuration";

/***
 * A Base Construct Implementation
 * ---
 *
 * The purpose behind the following resource is abstracting away boilerplate from
 * a simple configuration that's required as input upon stack initialization.
 *
 * For example, if a new stack is to be created, the Stack resource type will require
 * the following "tags":
 *
 * - tf
 * - cfn
 * - cloud
 * - service
 * - creator
 * - environment
 * - organization
 *
 * Then, when interfacing any pre-defined constructs (which implements Base properties), construct
 * attributes such as `identifier`, and related resource tags get automatically populated
 * from the parent stack's tags. Such ensures of globally unique resource names, and facilitates
 * resource look-up according to `cloud`, `service`, `creator`, `environment`, and `organization`.
 *
 * Note, `Base` aims to provide a schema -- a typescript specific concept that outlines
 * required object properties rather than inheritance. While classes could elect to inherit from
 * `Base`, it was found that escape hatches were much more difficult to implement when edge cases
 * would arise. Composition via a strictly checked runtime allows for overall much more
 * flexibility and extension.
 *
 */

class Base extends Construct {
    /*** Stateful Infrastructure Information & JSON Serializable Export(s) */
    public readonly state?: { [$: string]: State };

    static readonly ci = Configuration.ci;

    private static service: string;
    private static resource: string;
    private static identifier: string;

    /*** The Globally Defined Resource Type | Cloud Resource Reference | Constructor Alias */
    readonly instance: Type;

    private constructor(scope: Construct, name: string) {
        super(scope, name)
    };

    private static type: Function;
    private static mapping: Function;
    private static output: Function;
}

/***
 * The Globally Defined Resource Type
 * ---
 *
 * Resource Type | Cloud Resource Reference | Constructor Alias
 *
 * @example
 * import * as AWS from "@cdktf-provider/aws";
 *
 * type Type = AWS.ssm.SsmParameter;
 *
 */
type Type = any;

type State = TerraformOutput;
type Output = TerraformOutputConfig;

export { Base, Store };

export default Base;

export type { Output, State };
