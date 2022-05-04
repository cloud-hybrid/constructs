import FS      from "fs";
import Path    from "path";
import Utility from "util";
import Process from "process";

interface Options {
    /**
     * Dereference symlinks
     * @default false
     */
    dereference?: boolean;
    /**
     * When `force` is `false`, and the destination
     * exists, throw an error.
     * @default false
     */
    errorOnExist?: boolean;

    /**
     * Function to filter copied files/directories. Return
     * `true` to copy the item, `false` to ignore it.
     */
    filter?( source: string, destination: string ): boolean;

    /**
     * Overwrite existing file or directory. _The copy
     * operation will ignore errors if you set this to false and the destination
     * exists. Use the `errorOnExist` option to change this behavior.
     * @default true
     */
    force?: boolean;
    /**
     * When `true` timestamps from `src` will
     * be preserved.
     * @default false
     */
    preserveTimestamps?: boolean;
    /**
     * Copy directories recursively.
     * @default false
     */
    recursive?: boolean;
}

/***
 * Promisified Version of {@link FS.cp}
 * ---
 *
 * Asynchronously copies the entire directory structure from source to destination, including subdirectories and files.
 * - When copying a directory to another directory, globs are not supported.
 *
 * @experimental
 *
 * @param source {typeof import("fs").PathOrFileDescriptor} source path to copy.
 * @param target {typeof import("fs").PathOrFileDescriptor} destination path to copy to.
 * @returns {Promise<?>}
 *
 * @constructor
 *
 */

const Copy = async ( source: string, target: string ) => {
    const $ = FS.cp;

    /*** @type { FS.cp } */
    await new Promise( ( resolve ) => {
        $( Path.resolve( source ), Path.resolve( target ), {
            dereference: true,
            errorOnExist: false,
            filter: undefined,
            force: true,
            preserveTimestamps: false,
            recursive: true
        }, resolve );
    } );
};

export { Copy };

export default { Copy };
