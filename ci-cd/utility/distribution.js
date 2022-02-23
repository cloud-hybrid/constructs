import Chalk from "chalk";
import FS from "fs";
import Module from "module";
import OS from "os";
import Path from "path";
import Process from "process";
import Utility from "util";
/***
 * Inspired from ci-cd packaging limitations, `Walker` is a simple
 * class used for creating, copying, and deleting target source code
 * distribution(s), where copies are performed recursively; the following
 * class also establishes the ability to exclude nested file descriptors
 * (a folder or file) when calling its constructor.
 */
class Distribution {
    debug = false;
    directory;
    home = OS.homedir();
    /*** Current Module Directory */
    static CWD = Path.dirname(import.meta.url.replace("file" + ":" + "//", ""));
    /*** Current Module Working Directory */
    static MWD = Path.dirname(Distribution.CWD);
    /*** Current Package's Working Directory */
    static PWD = Path.dirname(Distribution.MWD);
    /*** Compatability Wrapper around Node.js's `require` */
    static Import = Module.createRequire(Distribution.PWD);
    /***
     *
     * @param target {string} - Target Directory for Distribution
     * @param debug {boolean} - Debug Parameter
     *
     * @constructs
     *
     */
    constructor(target, debug = false) {
        this.directory = target;
        this.debug = debug;
        FS.mkdirSync(target, { recursive: true });
    }
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
    static write = Utility.promisify(FS.writeFile);
    /***
     * Asynchronous, promise-based wrapper around `import("fs").rm` utility function.
     *
     * @internal
     * @private
     *
     */
    static remove = Utility.promisify(FS.rm);
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
    static async delete(path, retries, force, recursive) {
        const $ = async () => await Distribution.remove(path, { recursive, force, maxRetries: retries });
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
    static async directory(path) {
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
        console.debug("[Debug]", "Creating" + " " + Chalk.bold.blueBright("ci") + " " + "Directory ...");
        const system = Path.resolve(path);
        /*** @type {Promise<string | boolean>} */
        const awaitable = new Promise((resolve, reject) => {
            FS.mkdir(system, { recursive: true, mode: 0o775 }, (error) => {
                if (error && error.code === "EEXIST") {
                    console.debug("[Debug]", "Directory Already Exists");
                    resolve(system);
                }
                else if (error) {
                    console.warn("[Warning]", error);
                    reject(false);
                }
                else {
                    resolve(system);
                }
            });
        });
        console.debug("  ↳ " + Chalk.bold.greenBright("Successful"));
        /*** @type {(Promise<string | boolean> | string)[]} */
        return (typeof (await awaitable) === "string") ? [
            [
                ["file", ":", "//"].join(""), system
            ].join(""),
            system,
            Path.relative(Process.cwd(), system)
        ] : [
            awaitable,
            system,
            Path.relative(Process.cwd(), system)
        ];
    }
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
    static shallow(source, target) {
        FS.readdirSync(source).forEach((element) => {
            const Target = Path.join(source, element);
            const File = FS.lstatSync(Target, { throwIfNoEntry: true }).isFile();
            const Descriptor = Path.parse(Target);
            (File) && FS.copyFileSync(Path.format(Descriptor), Path.join(target, Descriptor.base));
        });
    }
}
export { Distribution };
export default Distribution;
//# sourceMappingURL=distribution.js.map