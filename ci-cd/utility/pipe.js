import Process from "process";
import Execute from "child_process";
class Pipe {
    /***
     * The application binary interface, or system-path'd callable
     *
     * @example
     *  - `git`
     *  - `node`
     *  - `python3`
     *
     */
    application;
    /***
     * Set of arguments to pass to the application upon call
     *
     * @example
     * - ["install", "--assume-yes", "jq"]
     * - ["status", "--porcelain"]
     *
     */
    parameters;
    /***
     * Indicates that an interactive sub-shell be spawned
     *
     * @warning - Employ caution if `true`
     *
     * It's highly recommended to leave shell set to its
     * default value of `false`. Spawning sub-shells is a dangerous option to include,
     * especially if the input command string(s) are in anyway dynamically generated
     * or calculated.
     *
     */
    shell;
    cwd;
    execute = Execute.spawnSync;
    /***
     * @private
     *
     * @param properties {Options} - ...
     *
     */
    constructor(properties) {
        this.application = properties.application;
        this.parameters = properties.parameters;
        this.shell = properties.shell;
        this.cwd = properties.cwd;
    }
    /***
     *
     * @private
     *
     * @returns {{Input: string, Output: void[], Error: Error | undefined}}
     *
     */
    spawn() {
        const $ = this.execute(this.application, this.parameters, {
            cwd: String(this.cwd),
            shell: this.shell,
            stdio: "pipe"
        });
        const buffer = Buffer.from($.stdout).toString().split("\n").map(($) => {
            return $.toString().trim();
        }).filter(($) => String($) !== "");
        return {
            error: $.error,
            input: [this.application, [...this.parameters].join(" ")].join(" "),
            output: buffer
        };
    }
    /***
     *
     * @public
     * @constructs
     * @constructor
     *
     * @param {string} application
     * @param {string[]} parameters
     *
     * @returns {Stream}
     *
     */
    static run = (application, parameters) => {
        const options = {
            application, parameters, cwd: Process.cwd(), shell: false
        };
        return new Pipe({ ...options }).spawn();
    };
    /***
     * Asynchronous Subprocess Spawner
     *
     * @param {string} command - Raw command as a single string
     * @param {string} directory - The spawned subprocess current-working-directory
     * @param {boolean} stdout - Write output to standard-output
     *
     * @returns {Promise<Stream>}
     *
     * @constructor
     *
     * @todo Refactor variable-name casing(s)
     *
     */
    static async poll(command, directory = Process.cwd(), stdout = false) {
        const Binary = command.split(" ")[0];
        const Arguments = command.split(" ").splice(1);
        const Data = {
            output: [],
            input: [],
            error: [],
            pid: -1,
            status: "",
            signal: ""
        };
        const Awaitable = new Promise((resolve) => {
            const Command = Execute.spawn(Binary, [...Arguments], {
                cwd: directory, env: Process.env, stdio: "pipe", shell: false
            });
            const Output = Command.stdout;
            const Error = Command.stderr;
            Output.on("data", ($) => {
                const Output = Buffer.from($).toString().split("\n");
                Output.forEach((line) => {
                    (line !== "") && Data.output.push(line.trim());
                });
                (stdout) && Process.stdout.write(Data.output.join("\n"));
            });
            Error.on("data", (_) => {
                let Allocation = 0;
                // Allocate an Array Buffer of (n + 1) Bytes
                const Buffer = _;
                Array(Buffer[Symbol.iterator]).forEach(() => Allocation += 1);
                // Shift <-- Left to Release Empty Byte for String[0]
                const Output = Buffer.toString();
                Data.error.push(Output);
                (stdout) && Process.stderr.write(Output);
                resolve(Output);
            });
            Command.on("error", ($) => {
                Data.pid = Command.pid || 0;
                Data.status = String($);
                Data.signal = Command.signalCode || "";
                resolve(Data);
            });
            Command.on("exit", ($) => {
                Data.pid = Command.pid || 0;
                Data.status = String($);
                Data.signal = Command.signalCode || "";
                resolve(Data);
            });
            Command.on("message", ($) => {
                const Output = Buffer.from($).toString();
                Data.output.push(Output);
                Process.stderr.write(Output);
            });
            Command.on("disconnect", () => {
                Data.pid = Command.pid || 0;
                Data.status = "-1";
                Data.signal = Command.signalCode || "";
                resolve(Data);
            });
            Command.on("close", ($) => {
                Data.pid = Command.pid || 0;
                Data.status = String($);
                Data.signal = Command.signalCode || "";
                resolve(Data);
            });
        });
        return await Awaitable;
    }
}
export { Pipe };
export default Pipe;
//# sourceMappingURL=pipe.js.map