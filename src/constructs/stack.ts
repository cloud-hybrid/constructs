import FS        from "fs";
import Path      from "path";
import Process   from "process";
import Assertion from "assert";
import Utility   from "util";

import { Tags }       from "../index.js";
import type { Input } from "../index.js";

import { Application, TF, Construct, Configuration, ID, Initialize } from "../configuration.js";

type Settings = ( scope: Construct, name: string ) => Configuration;

class Stack extends TF {
    configuration: Configuration;

    constructor( scope: Construct, name: string, settings: Settings) {
        super( scope, ID( name ) );

        this.configuration = settings( this, name );
    }
}

const Reconfigure = () => {
    for ( const $ in Process.argv ) {
        if ( Process.argv[$].includes( "reconfigure" ) ) return true;
    }

    return false;
};

const Validate = async (path: string) => {
    const configuration = () => FS.existsSync(path);

    (!configuration()) && (!Configuration.ci) && await Tags.prompt(path);

    Assertion.equal(configuration(), true, "Assertion Failure - \"configuration.json\" File Not Found");
};

/*** Ensure to have `configuration.json` relative to current working directory. */
const Synthesize = async (Infrastructure: any) => {
    const configuration = Path.join( Process.cwd(), "configuration.json" );

    /// npm run create-resource -- reconfigure
    ( Reconfigure() ) && await Tags.prompt(configuration);

    /// Validate Configuration -- Forcing a Prompt when Interactive TTY + !CI Environment, and
    /// configuration.json File is Found Invalid or Absent
    await Validate(configuration);

    // Upon `Initialize()`, a mutator is applied to the callable function; because the lifespan
    // of any given CDK runtime is short and intended only to run its entry-point once,
    // `Initialize` will assign a `settings` attribute to itself.
    //
    // In doing so, the callable achieves an abstract, exportable means of wrapping
    // Constructs + Stacks with a default and reusable backend + configuration, while being
    // capable of prompting its users, dynamically, for input if the configuration is found
    // to need modification.
    const $: ( scope: Construct, name: string ) => Configuration = await Initialize(configuration);
    const settings: Input = Reflect.get( Initialize, "settings" );

    const target = Path.join( Process.cwd(), "distribution" );
    (!Configuration.ci) && console.log( "[Log] Target Output Directory" + ":", target, "\n");

    FS.mkdirSync( target, { recursive: true } );
    const application = new Application( {
        skipValidation: false,
        stackTraces: true,
        outdir: target
    } );

    const name = [settings.organization, settings.environment, settings.service].join("-");

    (!Configuration.ci) && console.log("[Log] Stack-Name" + ":", name);

    const instance = new Infrastructure( application, name,  $ );

    application.synth();

    return instance;
};

export { Synthesize, TF, Stack, Construct, Configuration };

export type { Settings };
