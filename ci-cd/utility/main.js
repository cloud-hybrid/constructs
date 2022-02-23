import FS from "fs";
import Path from "path";
import Process from "process";
import Assertion from "assert";
import Chalk from "chalk";
import { Distribution } from "./distribution.js";
/***
 * Extension of {@link Distribution}
 */
class Main extends Distribution {
    static folder = "ci";
    static file = "main.ts";
    static resolve = () => Path.join(Process.cwd(), Main.folder);
    static target = () => Path.join(Main.resolve(), Main.file);
    static template = FS.readFileSync(Path.join(Main.CWD, "main.tpl"), { encoding: "utf-8" });
    /***
     *
     * @param target {string} - Target Directory for Distribution
     * @param debug {boolean} - Debug Parameter
     *
     * @constructs
     *
     */
    constructor(target = Main.resolve(), debug = false) {
        super(target, debug);
        Assertion.equal(FS.existsSync(target), true);
    }
    static async hydrate() {
        console.debug("[Debug]", "Hydrating" + " " + Chalk.bold.blueBright("main.ts") + " " + "File ...");
        const configuration = Main.template;
        FS.existsSync(Main.target()) || await Main.write(Main.target(), configuration);
        Assertion.equal(FS.existsSync(Main.target()), true);
        console.debug("  ↳ " + Chalk.bold.greenBright("Successful"));
    }
}
export { Main };
export default Main;
//# sourceMappingURL=main.js.map