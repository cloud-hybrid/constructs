/***
 * Subprocess Return Type
 */
interface Stream {
    output: string[];
    input: string[];
    error: string[];
    pid: number;
    status: string;
    signal: string;
}
/***
 *
 * Subprocess Spawner
 *
 * @param {string} command - Raw command as a single string
 * @param {string} directory - The spawned subprocess current-working-directory
 * @param {boolean} stdout - Write output to standard-output
 *
 * @returns {Promise<Stream>}
 *
 * @constructor
 *
 */
declare const Spawn: (command: string, directory?: string, stdout?: boolean) => Promise<Stream>;
export { Spawn };
export default Spawn;
