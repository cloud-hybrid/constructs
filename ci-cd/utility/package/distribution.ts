import Chalk from "chalk";

import FS      from "fs";
import Module  from "module";
import OS      from "os";
import Path    from "path";
import Process from "process";
import Utility from "util";

import $ from "./module.js";

/***
 * Inspired from ci-cd packaging limitations, `Distribution` provides a base
 * class definition for subsequent, more specific packaging classes to derive
 * from.
 *
 * - The `Distribution` class is only ECMA compatible (ESM Modules).
 *
 */

class Distribution {
    /*** The System User's Home Directory, Full System Path */
    protected readonly home: string = OS.homedir();

    /*** Class Namespace'd `debug` boolean Flag */
    public readonly debug: boolean = false;

    /*** Module Type Composition */
    public static readonly module = ( url: string = import.meta.url ) => $.initialize( url );

    /*** Current Module Directory */
    protected static readonly cwd = Path.dirname( import.meta.url.replace( "file" + ":" + "//", "" ) );
    /*** Compatability Wrapper around Node.js's `require` */
    public static readonly import = Module.createRequire( Distribution.cwd );

    /***
     * @param debug {boolean} - Debug Parameter
     *
     * @constructs
     *
     */

    constructor( debug: boolean = false ) {
        this.debug = debug;
    }

    /***
     * Asynchronous, promise-based wrapper around `import("fs").readFile` utility function.
     *
     * - Please note, in order to retrieve a string, simply perform a type-cast.
     *
     * @example
     * String(await Distribution.read("file.example.json)));
     *
     * @type {(path: (string | Buffer | URL | number)) => Promise<?>}
     *
     * @constructor
     * @public
     * @async
     *
     */

    public static read: ( path: ( string | Buffer | URL | number ) ) => Promise<Buffer> = Utility.promisify( FS.readFile );

    /***
     * Asynchronous, promise-based wrapper around `import("fs").writeFile` utility function.
     *
     * @type {
     *      (
     *           path: (string | Buffer | URL | number),
     *           data: (string | Uint8Array | Uint8ClampedArray | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array | BigUint64Array | BigInt64Array | Float32Array | Float64Array | DataView)
     *      ) => Promise<?>
     * }
     *
     * @internal
     * @private
     * @async
     *
     */

    /***
     * @private
     * @async
     *
     * @param {string} file - File path
     * @param {string} content - File contents
     *
     * @return {Promise<?>}
     */
    public static readonly write = async ( file: string, content: string ) => {
        const $ = FS.writeFile;

        return new Promise((resolve) => {
            $( file, content, { encoding: "utf-8", mode: 0o664 }, () => {
                resolve(true);
            } );
        });
    };

    /***
     * Asynchronous, promise-based wrapper around `import("fs").rm` utility function.
     *
     * @internal
     * @private
     * @async
     *
     */

    private static remove: ( path: FS.PathLike, options?: ( FS.RmOptions | undefined ) ) => Promise<void> = Utility.promisify( FS.rm );

    /***
     * Asynchronous implementation of `FS.rm`, wrapped with Node.js's Promisify
     * utility.
     *
     * > Asynchronously removes files and directories (modeled on the standard POSIX `rmutility`).
     * > No arguments other than a possible exception are given to the
     * > completion callback.
     *
     * @externs Distribution.remove
     * @constructor
     * @public
     *
     * @see {@link Distribution.remo}
     *
     */

    public static async delete( path: ( string ), retries: number, force: boolean, recursive: boolean ) {
        const $ = async () => await Distribution.remove( path, { recursive, force, maxRetries: retries } );

        await $();

        return;
    }

    /***
     * Asynchronously, Recursively, Validate & Establish a Directory
     * ---
     *
     * Upon success, the return datatype is of type [string, string, string],
     * where:
     *  - type[0] = (valid) ? File System URI := string : Error := boolean
     *  - type[1] = Full System Path := string
     *  - type[2] = Relative System Path from `Process.cwd()` := string
     *
     * @param {string} path
     *
     * @returns {Promise<(Promise<string | boolean> | string)[]>}
     *
     */

    static async directory( path: string = process.env?.["config_iac"] ?? "ci" ): Promise<( Promise<string | boolean> | string )[]> {
        console.debug( "[Log]", "Attempting to Resolve the" + " " + Chalk.bold.yellowBright( "\"" + Path.relative( Process.cwd(), path ) + "\"" ) + " " + "Directory ..." );

        /***
         * The right-most parameter is considered {`to`}. Other parameters are considered an array of {`from`}.
         * Starting from leftmost {`from`} parameter, resolves {`to`} to an absolute path.
         * If {`to`} isn't already absolute, {`from`} arguments are prepended in right to left order, until
         * an absolute path is found. If after using all {`from`} paths still no absolute path is found,
         * the current working directory is used as well. The resulting path is normalized, and trailing
         * slashes are removed unless the path gets resolved to the root directory.
         *
         * @type {string}
         *
         */

        const system: string = Path.resolve( path );

        /*** @type {Promise<string | boolean>} */
        const awaitable = new Promise<string | boolean>( ( resolve, reject ) => {
            FS.mkdir( system, { recursive: true, mode: 0o775 }, ( error ) => {
                if ( error && error.code === "EEXIST" ) {
                    console.debug( "[Debug]", "Directory Already Exists" );
                    resolve( system );
                } else if ( error ) {
                    console.warn( "[Warning]", error );
                    reject( false );
                } else {
                    resolve( system );
                }
            } );
        } );

        console.debug( "  ↳ " + Chalk.bold.greenBright( "Successful" ) );

        /*** @type {(Promise<string | boolean> | string)[]} */
        return ( typeof ( await awaitable ) === "string" ) ? [
            [
                [ "file", ":", "//" ].join( "" ), system ].join( "" ),
            system,
            Path.relative( Process.cwd(), system )
        ] : [
            awaitable,
            system,
            Path.relative( Process.cwd(), system )
        ];
    }

    /***
     * Shallow Copy
     *
     * Specifying a target directory to copy into, `shallow` will parse the
     * source folder, gather the file(s) found, and copy them to the target.
     *
     * @param source {string}
     * @param target {string}
     *
     * @constructor
     *
     */

    public static shallow( source: string, target: string ) {
        FS.readdirSync( source ).forEach( ( element ) => {
            const Target = Path.join( source, element );
            const File = FS.lstatSync( Target, { throwIfNoEntry: true } ).isFile();
            const Descriptor = Path.parse( Target );

            ( File ) && FS.copyFileSync( Path.format( Descriptor ), Path.join( target, Descriptor.base ) );
        } );
    }
}

export { Distribution };

export default Distribution;