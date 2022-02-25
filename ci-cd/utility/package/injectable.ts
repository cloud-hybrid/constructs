import Chalk             from "chalk";
import Path              from "path";
import Process           from "process";
import { Base, Options } from "./base.js";

/***
 * Extension of {@link Base}
 */

class Injectable extends Base {
    /***
     * @see {@link Base}
     */

    public constructor( url: string, type: Options, overload?: string ) {
        super( url, type, process.env?.["config_iac"] ?? "ci", overload );
    }

    protected log() {
        Process.stdout.write( "\n" );
        console.debug( "[Log]", "Template File" + ":" + " " + Chalk.bold.blueBright( Path.basename( this.source ) ) );
        console.debug( Chalk.bold( "  ↳ " ) + Chalk.dim( "Hydrating Template File ..." ) );
        console.debug( Chalk.bold( "  — " ) + "Target" + ":", Chalk.bold.red( Path.basename( this.target ) ) );
        console.debug( Chalk.bold( "  — " ) + "Directory" + ":", Chalk.bold.yellow( Path.basename( Path.dirname( this.target ) ) ) );
    }
}

export { Injectable };

export default Injectable;