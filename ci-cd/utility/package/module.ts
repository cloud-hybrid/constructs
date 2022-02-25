import FS      from "fs";
import Path    from "path";
import URI     from "url";
import Process from "process";

import * as Scanner from "@nodelib/fs.scandir";
import { Entry }    from "@nodelib/fs.walk";

type Type = keyof typeof Types;
import { PathLike } from "fs";

enum Types {
    CJS = "CJS",
    ECMA = "ECMA",
    TS = "TypeScript",
    JS = "JavaScript"
}

interface Module {
    /*** Resolvable URL via Protocol */
    url: string;

    /*** Resolvable, Full System Path URI via Pathing */
    uri: string;

    /*** Full System, Extension-Stripped Path of Caller's Directory */
    directory: string;
    /*** Target File Extension */
    extension: string;

    /*** Directory Name, Normalized */
    basename: string;

    /*** Target File-Name, Normalized */
    name: string;

    /*** Relative Path from Process.cwd() to Target */
    relative: string | PathLike | undefined;

    package: { $: string; directory: string; };
    parent: { $: string; directory: string; };
}

/***
 * Module Class Package Resolver
 * ---
 *
 * A meta-type for individual modules to provide filesystem
 * metadata, primarily for the purpose of exporting to consumers.
 *
 * Includes convenience methods including dirname and filename
 * that's essentially a wrapper around CommonJS `__filename`
 * && `__dirname`.
 *
 * Additionally, ensures the correct decodings of percent-encoded characters as
 * well as ensuring a cross-platform valid absolute path string.
 *
 * @example
 *
 * const Module = new Locality(import.meta.url);
 *
 * @example
 *
 * const Module = Locality.initialize(import.meta.url);
 *
 */

class Module implements Module {
    private constructor( importable: string ) {
        this.url = importable;
        this.uri = URI.fileURLToPath( this.url );
        this.directory = Path.resolve( Path.dirname( this.uri ) );
        this.relative = Path.relative( Process.cwd(), this.uri );

        this.basename = Path.basename( this.uri );
        this.extension = Path.extname( this.uri );
        this.name = this.basename.replace(this.extension, "");

        this.package = this.source();
        this.parent = this.source(Path.dirname(this.package.directory));
    }

    public static initialize( self: string ): Module {
        return Reflect.construct( Module, [ self ] );
    }

    /***
     * Locate the Closest `package.json`
     *
     * @param {string} path
     */

    /***
     * @param {string} path
     * @private
     */
    private source( path: string = Path.dirname( this.uri ) ): { $: string; directory: string; } {
        const $ = Scanner.scandirSync( path ).filter( ( $ ) => $.name === "package.json" ).map( ( $ ) => $ );

        return ( $.length > 0 ) ? { $: $[0].path, directory: Path.dirname( $[0].path ) } : this.source( Path.dirname( path ) );
    }
}

export { Module };

export default Module;