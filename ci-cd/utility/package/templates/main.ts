import Chalk from "chalk";
import FS    from "fs";

import { Injectable } from "../index.js";

/***
 * Extension of {@link Injectable}
 */

class Main extends Injectable {
    /***
     * @see {@link Injectable}
     */
    constructor() {
        super( import.meta.url /* __filename */, "ts", null );
    }

    public async hydrate() {
        super.log();

        const create = !FS.existsSync( this.target );

        if (create) {
            /// @todo Unit Tests (See changes for version 0.7.214)
            const installable = Main.module(import.meta.url);
            const target = installable.package?.$
            const content = (target) ? await Main.read( target ) : JSON.stringify({});

            const $ = String( content );

            const serialized = JSON.parse( $ );

            await this.template.inject( this.source, this.target,[ {
                pattern: "Self",
                replacement: serialized.name
            } ] );

            console.debug( Chalk.bold( "  — " ) + "Result" + ":", Chalk.bold.green( "Successful" ) );
        } else {
            console.debug( Chalk.bold( "  — " ) + "Result" + ":", Chalk.bold.dim.italic( "Skipped" ) );
        }
    }
}

export { Main };

export default { Main };

/// module.exports = { Main };

