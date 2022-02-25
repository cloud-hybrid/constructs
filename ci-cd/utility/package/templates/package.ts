import FS      from "fs";
import Path    from "path";
import Process from "process";

import Chalk from "chalk";

import { Injectable } from "../index.js";

/***
 * Extension of {@link Injectable}
 */

class Package extends Injectable {
    /***
     * @see {@link Injectable}
     */
    constructor() {
        super( import.meta.url, "json", null );
    }

    public async hydrate() {
        super.log();

        const create = !FS.existsSync( this.target );

        switch ( create ) {
            case true: {

                const $ = String( await Package.read( Package.module().parent.$ ) );
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

                const content = await this.template.inject( injection );

                await Injectable.write( this.target, String( content ) );

                console.debug( Chalk.bold( "  — " ) + "Result" + ":", Chalk.bold.green( "Successful" ) );

                break;
            }
            default: {
                console.debug( Chalk.bold( "  — " ) + "Result" + ":", Chalk.bold.dim.italic( "Skipped" ) );

                break;
            }
        }
    }
}

export { Package };

export default Package;