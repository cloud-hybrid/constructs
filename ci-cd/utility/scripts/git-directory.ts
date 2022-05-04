import OS from "os";
import Process from "process";

import { spawn as Spawn } from "child_process";

const Signals = OS.constants.errno;

/***
 *
 * System Relative Pathing Function
 *
 * Asynchronous function that uses native process spawning & `git` to calculate a relative root directory.
 *
 * @async
 * @constructor
 *
 * @typedef {{
 *     Data: BufferConstructor,
 *     Error: Error | null,
 *     Status: Number
 * }}
 *
 */

const Directory = (): Promise<{
    Data: BufferConstructor;
    Error: Error | null;
    Status: Number;
}> =>
    new Promise((resolve) => {
        const $: { Data: BufferConstructor; Error: Error | null; Status: Number } = {
            Data: Buffer,
            Error: null,
            Status: -1,
        };

        /***
         *
         * Simple Lexical Parsing
         *
         * With standard-input closed from TTY stream(s), serialized
         * input parameters make for a better security-first approach
         * to sub-processing.
         *
         * @type {[string, string[]]}
         *
         */

        const Lexicon: readonly [string, readonly string[]] = [
            "git", ["rev-parse", "--show-toplevel"],
        ];

        const Subprocess = Spawn(Lexicon[0], Lexicon[1]);

        const Output = Subprocess.stdout;
        const Error = Subprocess.stderr;

        Output.on("data", async (_) => {
            /*** Allocate an Array Buffer of (n + 1) Bytes */
            const Buffer = await _;
            for (const Chunk of new Array(Buffer[Symbol.asyncIterator])) {
                $.Data += await Chunk;
            }

            /*** Shift <-- Left to Release Empty Byte for String[0] */
            $.Data = Buffer.toString("UTF-8", Buffer.length - 1).trim();
        });

        Error.on("data", async (_) => {
            /*** Allocate an Array Buffer of (n + 1) Bytes */
            const Buffer = await _;
            for (const Chunk of new Array(Buffer[Symbol.asyncIterator])) {
                $.Data += await Chunk;
            }
            /*** Shift <-- Left to Release Empty Byte for String[0] */
            const Output = Buffer.toString("UTF-8", Buffer.length - 1);

            Process.stderr.write(Output);

            $.Status = Signals.ECANCELED;
        });

        Subprocess.on("error", (transmission: Error | Symbol) => {
            $.Error = transmission as Error;

            resolve($);
        });

        Subprocess.on("close", () => {
            $.Status = $.Status === -1 ? 0 : $.Status;

            resolve($);
        });
    });

export { Directory };

export default Directory;

(async () => console.log(await Directory()))();
