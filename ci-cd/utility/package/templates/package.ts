import Chalk   from "chalk";
import FS      from "fs";
import Path    from "path";
import Process from "process";

import { Injectable } from "../index.js";

/***
 * Extension of {@link Injectable}
 */

class Package extends Injectable {
    /***
     * @see {@link Injectable}
     */
    constructor() {
        super( import.meta.url /* __filename */, "json", null );
    }

    public async hydrate() {
        super.log();

        const create = !FS.existsSync( this.target );

        if (create) {
            /// @todo Unit Tests (See changes for version 0.7.214)
            const installable = Package.module(import.meta.url);
            const target = installable.package?.$
            const content = (target) ? await Package.read( target ) : JSON.stringify({});

            const $ = String( content );

            const serialized = JSON.parse( $ );

            /// If the current working directory contains a `package.json`, extract the `"name"` key
            /// and join it via a "-" character, suffixed with "iac". Otherwise, simply set it to
            /// "iac".
            ///
            /// name := "[name]-iac" ?? "iac"
            const name: string = ( FS.existsSync( Path.join( Process.cwd(), "package.json" ) ) )
                ? [
                    JSON.parse( String(
                        await Injectable.read(
                            Path.join( Process.cwd(), "package.json" )
                        )
                    ) )?.["name"],
                    "iac"
                ].join( "-" )
                : "iac";

            /// Here, `version` is self-referencing the package's version, not the end-user's.
            /// Such is to avoid having to manually update the *.tpl templates.
            /// Therefore, it can be assumed for it to always exist.
            const version: string = serialized.version;

            /// Same as with `version` -- `self` is self-referencing the package's name.
            /// Given I'm thinking about changing the package's name, such is with the
            /// future potential changes in mind.
            const self: string = serialized.name;

            const injection = [ {
                pattern: "Self",
                replacement: self
            }, {
                pattern: "Name",
                replacement: name
            }, {
                pattern: "Version",
                replacement: version
            } ];

            await this.template.inject( this.template.file, this.target, injection );

            console.debug( Chalk.bold( "  — " ) + "Result" + ":", Chalk.bold.green( "Successful" ) );
        } else {
            console.debug( Chalk.bold( "  — " ) + "Result" + ":", Chalk.bold.dim.italic( "Skipped" ) );
        }
    }
}

export { Package };

export default { Package };

/// module.exports = { Package };