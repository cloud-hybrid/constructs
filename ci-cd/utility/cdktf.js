import FS from "fs";
import Path from "path";
import Process from "process";
import Assertion from "assert";
import Chalk from "chalk";
import { Distribution } from "./distribution.js";
/***
 * Extension of {@link Distribution}
 */
class CDKTF extends Distribution {
    static folder = "ci";
    static file = "cdktf.json";
    static resolve = () => Path.join(Process.cwd(), CDKTF.folder);
    static target = () => Path.join(CDKTF.resolve(), CDKTF.file);
    /***
     *
     * @param target {string} - Target Directory for Distribution
     * @param debug {boolean} - Debug Parameter
     *
     * @constructs
     *
     */
    constructor(target = CDKTF.resolve(), debug = false) {
        super(target, debug);
        Assertion.equal(FS.existsSync(target), true);
    }
    static async generate() {
        console.debug("[Debug]", "Generating" + " " + Chalk.bold.blueBright("cdktf.json") + " " + "File ...");
        const configuration = JSON.stringify({
            ...{
                language: "typescript",
                app: "node --no-warnings --enable-source-maps -r source-map-support/register --es-module-specifier-resolution node .",
                terraformModules: [],
                terraformProviders: [],
                output: "distribution",
                context: {
                    "allowSepCharsInLogicalIds": "true",
                    "excludeStackIdFromLogicalIds": "true"
                }
            }, ...{
                terraformProviders: CDKTF.Import(Path.join(CDKTF.PWD, "cdktf.json")).terraformProviders
            }
        }, null, 4);
        await CDKTF.write(CDKTF.target(), configuration);
        Assertion.equal(FS.existsSync(CDKTF.target()), true);
        console.debug("  ↳ " + Chalk.bold.greenBright("Successful"));
    }
}
export { CDKTF };
export default CDKTF;
//# sourceMappingURL=cdktf.js.map