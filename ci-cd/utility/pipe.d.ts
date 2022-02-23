declare class Pipe implements Subprocess {
    /***
     * The application binary interface, or system-path'd callable
     *
     * @example
     *  - `git`
     *  - `node`
     *  - `python3`
     *
     */
    application: string;
    /***
     * Set of arguments to pass to the application upon call
     *
     * @example
     * - ["install", "--assume-yes", "jq"]
     * - ["status", "--porcelain"]
     *
     */
    parameters: string[];
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
    shell: boolean;
    cwd: string;
    private execute;
    /***
     * @private
     *
     * @param properties {Options} - ...
     *
     */
    constructor(properties: Subprocess);
    /***
     *
     * @private
     *
     * @returns {{Input: string, Output: void[], Error: Error | undefined}}
     *
     */
    spawn(): {
        error: Error;
        input: string;
        output: string[];
    };
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
    static run: (application: string, parameters: string[]) => {
        error: Error;
        input: string;
        output: string[];
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
    static poll(command: string, directory?: string, stdout?: boolean): Promise<Stream>;
}
/***
 * Asynchronous Subprocess Return Type
*/
interface Stream {
    output: string[];
    input: string[];
    error: string[];
    pid: number;
    status: string;
    signal: string;
}
export interface Command {
    application: string;
    parameters: string[];
}
export interface Subprocess extends Command {
    cwd: string;
    shell: boolean;
}
export { Pipe };
export default Pipe;
