import Path    from "path";
import Process from "process";
import Chalk   from "chalk";

import { Base, Options } from "./base.js";

/***
 * Extension of {@link Base}
 * ---
 *
 * Assumes no Template Injections
 *
 */

class Raw extends Base {
    /***
     * @see {@link Base}
     */
    public constructor( url: string, type: Options, overload?: string ) {
        super( url, type, process.env?.["config_iac"] ?? "ci", overload );
    }

    public async populate() {
        Process.stdout.write( "\n" );

        console.debug( "[Log]", "Template File" + ":" + " " + Chalk.bold.blueBright( Path.basename( this.source ) ) );
        console.debug( Chalk.bold( "  ↳ " ) + Chalk.dim( "Copying Template to Target File Descriptor ..." ) );

        const content = await this.template.inject();

        console.debug( Chalk.bold( "  — " ) + "Target" + ":", Chalk.bold.red( Path.basename( this.target ) ) );
        console.debug( Chalk.bold( "  — " ) + "Directory" + ":", Chalk.bold.yellow( Path.basename( Path.dirname( this.target ) ) ) );

        await Raw.write( this.target, content );

        console.debug( Chalk.bold( "  — " ) + "Result" + ":", Chalk.bold.green( "Successful" ) );
    }
}

export { Raw };

export default Raw;