import FS        from "fs";
import Path      from "path";
import Process   from "process";
import Assertion from "assert";

import Chalk from "chalk";

import { Distribution } from "./distribution.js";

/***
 * Extension of {@link Distribution}
 */

class Main extends Distribution {
    public static readonly folder = "ci";
    public static readonly file = "main.ts";

    private static readonly resolve = () => Path.join( Process.cwd(), Main.folder );
    private static readonly target = () => Path.join( Main.resolve(), Main.file );

    public static template: string = FS.readFileSync( Path.join( Main.CWD, "main.tpl" ), { encoding: "utf-8" } );

    /***
     *
     * @param target {string} - Target Directory for Distribution
     * @param debug {boolean} - Debug Parameter
     *
     * @constructs
     *
     */

    constructor( target: string = Main.resolve(), debug: boolean = false ) {
        super( target, debug );

        Assertion.equal( FS.existsSync( target ), true );
    }

    static async hydrate() {
        console.debug( "[Debug]", "Hydrating" + " " + Chalk.bold.blueBright("main.ts") + " " + "File ..." );

        const configuration = Main.template;

        FS.existsSync(Main.target()) || await Main.write( Main.target(), configuration );

        Assertion.equal( FS.existsSync( Main.target() ), true );

        console.debug("  ↳ " + Chalk.bold.greenBright("Successful"));
    }
}

export { Main };

export default Main;