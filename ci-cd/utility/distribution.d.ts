/// <reference types="node" />
import FS from "fs";
/***
 * Inspired from ci-cd packaging limitations, `Walker` is a simple
 * class used for creating, copying, and deleting target source code
 * distribution(s), where copies are performed recursively; the following
 * class also establishes the ability to exclude nested file descriptors
 * (a folder or file) when calling its constructor.
 */
declare class Distribution {
    readonly debug: boolean;
    readonly directory: string;
    readonly home: string;
    /*** Current Module Directory */
    protected static readonly CWD: string;
    /*** Current Module Working Directory */
    protected static readonly MWD: string;
    /*** Current Package's Working Directory */
    protected static readonly PWD: string;
    /*** Compatability Wrapper around Node.js's `require` */
    protected static readonly Import: NodeRequire;
    /***
     *
     * @param target {string} - Target Directory for Distribution
     * @param debug {boolean} - Debug Parameter
     *
     * @constructs
     *
     */
    constructor(target: string, debug?: boolean);
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
     *
     */
    protected static write: (path: (string | Buffer | URL | number), data: (string | Uint8Array | Uint8ClampedArray | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array | BigUint64Array | BigInt64Array | Float32Array | Float64Array | DataView)) => Promise<void>;
    /***
     * Asynchronous, promise-based wrapper around `import("fs").rm` utility function.
     *
     * @internal
     * @private
     *
     */
    protected static remove: (path: FS.PathLike, options?: (FS.RmOptions | undefined)) => Promise<void>;
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
    static delete(path: (string), retries: number, force: boolean, recursive: boolean): Promise<void>;
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
}
export { Distribution };
export default Distribution;
