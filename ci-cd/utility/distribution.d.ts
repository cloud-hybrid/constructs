/// <reference types="node" />
import FS from "fs";
/***
 * Inspired from ci-cd packaging limitations, `Walker` is a simple
 * class used for creating, copying, and deleting target source code
 * distribution(s), where copies are performed recursively; the following
 * class also establishes the ability to exclude nested file descriptors
 * (a folder or file) when calling its constructor.
 */
declare class Walker {
    /***
     * Asynchronous, promise-based wrapper around `import("fs").rm` utility function.
     *
     * @internal
     * @private
     *
     */
    private static Remove;
    /*** Target-level directories to avoid copying into distribution */
    ignore: string[];
    /*** Debug parameter used during the various class-instance namespace'd callables */
    debug: boolean;
    /*** The target directory for the distribution */
    target: string | FS.PathLike;
    files: string[];
    compilations: string[];
    directory: any;
    /***
     *
     * @param {string[]} undesired - Target-level directories to avoid copying into distribution
     *
     * @param target {string} - Target Directory for Distribution
     * @param debug {boolean} - Debug Parameter
     *
     * @constructs
     *
     */
    constructor(target: string, undesired?: string[], debug?: boolean);
    /***
     * Asynchronous implementation of `FS.rm`, wrapped with Node.js's Promisify
     * utility.
     *
     * > Asynchronously removes files and directories (modeled on the standard POSIX `rmutility`).
     * > No arguments other than a possible exception are given to the
     * > completion callback.
     *
     * @constructor
     *
     */
    static remove(path: (string), retries: number, force: boolean, recursive: boolean): Promise<void>;
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
    static directory(path: string): Promise<(Promise<string | boolean> | string)[]>;
    /***
     * Recursive Copy Function
     *
     * *Note* - the following function is recursive, and will perform *actual, real copies*; symbolic
     * links are resolved to their raw pointer location(s).
     *
     * Hoisted package linking is damaging, and is an important considerations especially when
     * building for reproducible distributions.
     *
     * @param source {string} Original path
     * @param target {string} Target copy destination
     *
     * @constructor
     *
     */
    copy(source: string, target: string): void;
    /***
     * Shallow Copy
     *
     * Specifying a target directory to copy into, `shallow` will parse the
     * source folder, gather the file(s) found, and copy them to the target.
     *
     * In contrast to `copy`, folder(s) will not be recursively included.
     *
     * @param source {string}
     * @param target {string}
     *
     * @constructor
     *
     */
    static shallow(source: string, target: string): void;
    accumulate(target: string): void;
}
export { Walker };
export default Walker;
