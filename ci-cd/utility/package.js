import FS from "fs";
import Path from "path";
import Process from "process";
import Assertion from "assert";
import Chalk from "chalk";
import { Distribution } from "./distribution.js";
/***
 * Extension of {@link Distribution}
 */
class Package extends Distribution {
    static file = "package.json";
    static folder = "ci";
    static resolve = () => Path.join(Process.cwd(), Package.folder, Package.file);
    static source = () => Path.join(Process.cwd(), Package.file);
    static target = () => Package.source();
    static contents = JSON.parse(FS.readFileSync(Package.source(), { encoding: "utf-8" }));
    /***
     *
     * @param target {string} - Target Directory for Distribution
     * @param debug {boolean} - Debug Parameter
     *
     * @constructs
     *
     */
    constructor(target, debug = false) {
        super(target, debug);
        Assertion.equal(FS.existsSync(target), true);
    }
    static async reconfigure() {
        console.debug("[Debug]", "Establishing" + " " + Chalk.bold.blueBright("package.json") + " " + "File ...");
        const configuration = JSON.stringify({
            ...{
                name: [Package.contents.name, "iac"].join("-"),
                private: true,
                version: "0.0.1",
                type: "module",
                main: "main.js",
                types: "main.ts",
                scripts: {
                    build: "tsc",
                    compile: "tsc --watch",
                    get: "cdktf get",
                    synth: "cdktf synth",
                    deploy: "cdktf deploy",
                    start: "npm run initialize",
                    initialize: "node --no-warnings --enable-source-maps -r source-map-support/register --es-module-specifier-resolution node ."
                },
                dependencies: {
                    "@cloud-technology/constructs": Package.Import(Path.join(Package.PWD, "package.json")).version,
                    "typescript": "^4.5.5"
                },
                devDependencies: {
                    "source-map-support": "latest",
                    "@types/node": "latest",
                    "@types/source-map-support": "latest"
                }
            }
        }, null, 4);
        await Package.write(Package.resolve(), configuration);
        Assertion.equal(FS.existsSync(Package.target()), true);
        console.debug("  ↳ " + Chalk.bold.greenBright("Successful"));
    }
}
export { Package };
export default Package;
//# sourceMappingURL=package.js.map