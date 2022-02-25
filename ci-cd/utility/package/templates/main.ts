import FS      from "fs";
import Path    from "path";
import Process from "process";

import Chalk from "chalk";

import { Injectable } from "../index.js";

/***
 * Extension of {@link Injectable}
 */

class Main extends Injectable {
    /***
     * @see {@link Injectable}
     */
    constructor() {
        super( import.meta.url, "ts", null );
    }

    public async hydrate() {
        super.log();

        const create = !FS.existsSync(this.target);

        const $ = String( await Main.read( Main.module().parent.$ ) );
        const serialized = JSON.parse( $ );

        switch (create) {
            case true: {
                const content = await this.template.inject( [ {
                    pattern: "Self",
                    replacement: serialized.name
                } ] );

                await Injectable.write( this.target, String( content ) );

                console.debug( Chalk.bold( "  — " ) + "Result" + ":", Chalk.bold.green( "Successful" ) );

                break;
            }
            default:
                console.debug( Chalk.bold( "  — " ) + "Result" + ":", Chalk.bold.dim.italic( "Skipped" ) );

                break;
        }
    }
}

export { Main };

export default Main;