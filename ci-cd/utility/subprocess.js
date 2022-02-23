import Subprocess from "child_process";
import Process from "process";
/***
 * Subprocess Spawner
 *
 * @param {string} command - Raw command as a single string
 * @param {string} directory - The spawned subprocess current-working-directory
 * @param {boolean} stdout - Write output to standard-output
 *
 * @param {boolean} silent - Silence Output
 * @returns {Promise<Stream>}
 *
 * @constructor
 *
 */
const Spawn = async (command, directory = Process.cwd(), stdout = false, silent = false) => {
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
    const Awaitable = new Promise((resolve, reject) => {
        const Command = Subprocess.spawn(Binary, [...Arguments], {
            cwd: directory, env: Process.env, stdio: (silent) ? "ignore" : "inherit", shell: false
        });
        const Output = Command?.stdout;
        const Error = Command?.stderr;
        (Output) && Output.on("data", ($) => {
            const Output = Buffer.from($).toString().split("\n");
            Output.forEach((line) => {
                (line !== "") && Data.output.push(line.trim());
            });
            (stdout) && Process.stdout.write(Data.output.join("\n"));
        });
        (Error) && Error.on("data", (_) => {
            let Allocation = 0;
            // Allocate an Array Buffer of (n + 1) Bytes
            const Buffer = _;
            Array(Buffer[Symbol.iterator]).forEach(() => Allocation += 1);
            // Shift <-- Left to Release Empty Byte for String[0]
            const Output = Buffer.toString();
            Data.error.push(Output);
            (stdout) && Process.stderr.write(Output);
            reject(Output);
        });
        Command.on("error", ($) => {
            Data.pid = Command.pid || 0;
            Data.status = String($);
            Data.signal = Command.signalCode || "";
            console.error("Error Spawning Subprocess");
            reject(Data);
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
};
export { Spawn };
export default Spawn;
//# sourceMappingURL=subprocess.js.map