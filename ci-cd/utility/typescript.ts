import FS        from "fs";
import Path      from "path";
import Process   from "process";
import Assertion from "assert";

import Chalk from "chalk";

import { Distribution } from "./distribution.js";

/***
 * Extension of {@link Distribution}
 */

class Typescript extends Distribution {
    public static readonly src = "tsconfig.tpl";
    public static readonly file = "tsconfig.json";
    public static readonly folder = "ci";

    public static readonly contents?: typeof import("../tsconfig.json") = JSON.parse( FS.readFileSync( Path.join( Typescript.CWD, Typescript.src ), { encoding: "utf-8" } ) );

    private static readonly target = () => Path.join( Process.cwd(), Typescript.folder, Typescript.file );

    /***
     *
     * @param target {string} - Target Directory for Distribution
     * @param debug {boolean} - Debug Parameter
     *
     * @constructs
     *
     */

    constructor( target: string, debug: boolean = false ) {
        super( target, debug );

        Assertion.equal( FS.existsSync( target ), true );
    }

    static async create() {
        console.debug( "[Debug]", "Writing" + " " + Chalk.bold.blueBright( "cdktf.json" ) + " " + "File ..." );

        const configuration = JSON.stringify( Typescript.contents, null, 4 );

        await Typescript.write( Typescript.target(), configuration );

        Assertion.equal( FS.existsSync( Typescript.target() ), true );

        console.debug( "  ↳ " + Chalk.bold.greenBright( "Successful" ) );
    }
}

export { Typescript };

export default Typescript;