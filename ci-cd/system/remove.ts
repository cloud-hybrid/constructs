import Path from "path";
import Process from "process";
import Utility from "util";
import FS from "fs";

/***
 * Promisified Version of {@link FS.rm}
 * ---
 *
 * Asynchronously removes files and directories (modeled on the standard POSIX `rmutility`).
 *
 * - When specifying a target directory, globs are not supported.
 * - No arguments other than a possible exception are given to the completion callback.
 *
 * @param target {typeof import("fs").PathOrFileDescriptor} destination path to recursively delete.
 * @returns {Promise<void>}
 *
 * @constructor
 *
 */

const Remove = async (target: string) => {
    const $ = Utility.promisify(FS.rm);

    await $(Path.resolve(target), {
        force: true,
        maxRetries: 3,
        recursive: true,
        retryDelay: 250
    });
};

export { Remove };