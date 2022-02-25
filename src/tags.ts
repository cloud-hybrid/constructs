import FS      from "fs";
import Path    from "path";
import Process from "process";

import Prompt, { Question, Validation } from "./utility/question";

import { AwsProviderDefaultTags } from "@cdktf/provider-aws";

type Tagging = AwsProviderDefaultTags;

enum Cloud {
    AWS = "AWS",
    GCP = "GCP",
    DO = "Digital-Ocean",
    Azure = "Azure"
}

type Clouds = keyof typeof Cloud;

enum Environment {
    Development = "Development",
    QA = "QA",
    Staging = "Staging",
    UAT = "UAT",
    Production = "Production"
}

type Environments = keyof typeof Environment;

interface Input {
    tf: "True";
    cfn: "False";
    cloud: Clouds;

    creator: string;
    service: string;
    organization: string;

    environment: Environments;
}

class Default {
    environment: Environments;

    organization: string;
    service: string;
    creator: string;

    cloud: Clouds;
    cfn: "False";
    tf: "True";

    constructor( input: Input ) {
        this.organization = input.organization;
        this.environment = input.environment;
        this.service = input.service;
        this.creator = input.creator;
        this.cloud = input.cloud;
        this.cfn = input.cfn;
        this.tf = input.tf;
    }

    map() {
        return {
            Organization: String( this.organization ?? "N/A" ),
            Environment: String( this.environment ?? "N/A" ),
            Service: String( this.service ?? "N/A" ),
            Creator: String( this.creator ?? "N/A" ),
            Cloud: String( this.cloud ?? "N/A" ),
            CFN: String( this.cfn ?? "N/A" ),
            TF: String( this.tf ?? "N/A" )
        };
    }
}

class Tags implements Tagging {
    tags?: { [$: string]: string };

    constructor( configuration?: { [$: string]: string } ) {
        this.tags = configuration;
    }

    public static initialize( input: Input ) {
        const $ = new Default( input );

        return new Tags( { ... $.map() } );
    }

    public static async prompt( path: string ) {
        const $: Input = ( FS.existsSync( path ) ) ? ( await import(path) ).default : null;

        ($) && console.log( "[Log] Current Configuration" + ":", $, "\n" );

        console.log( "[Log] Awaiting User-Input ...", "\n" );

        const Organization = await Question.prompt( [ Prompt.Field.initialize( "$", "Organization", $?.organization ?? null, Validation.valid ) ] ).then( ( $ ) => $ );
        const Environment = await Question.prompt( [ Prompt.Selectable.initialize( "$", "Environment", [ "Development", "QA", "Staging", "UAT", "Production" ] ) ] ).then( ( $ ) => $ );
        const Service = await Question.prompt( [ Prompt.Field.initialize( "$", "Service", $?.service ?? null, Validation.valid ) ] ).then( ( $ ) => $ );
        const Creator = await Question.prompt( [ Prompt.Field.initialize( "$", "Creator", $?.creator ?? null, Validation.valid ) ] ).then( ( $ ) => $ );
        const Cloud = await Question.prompt( [ Prompt.Selectable.initialize( "$", "Cloud", [ "AWS", "GCP", "Digital-Ocean", "Azure" ], $?.cloud ?? null, Validation.valid ) ] ).then( ( $ ) => $ );

        Process.stdout.write( "\n" );

        const instance = new Default( {
            environment: Environment["$"],
            organization: Prompt.normalize(Organization["$"]),
            service: Prompt.normalize(Service["$"]),
            creator: Creator["$"],
            cloud: Cloud["$"],
            cfn: "False",
            tf: "True"
        } );

        const defaults = new Tags();

        defaults.tags = { ... instance };

        const target = JSON.stringify( instance, null, 4 );
        const source = ($) ? JSON.stringify( FS.readFileSync( path, { encoding: "utf-8" } ) ) : null;

        ( source !== target ) && FS.writeFileSync( path, target );

        return defaults;
    }
}

const Entry = ( input: Input ) => Tags.initialize( input );

export { Entry, Tags, Default };

export default { Entry, Tags, Default };

export type { Environments, Input, Tagging };
