#!/usr/bin/env node
/***
 * Assumptions:
 * - User is going to have source code in relative root directory
 * - User has a `package.json` at relative directory (process.cwd())
 * - User does not have a ./ci directory
 */
import Path from "path";
import Process from "process";
import Chalk from "chalk";
import * as Utility from "./utility/index.js";
const CWD = Process.cwd();
const Parameters = Process.argv.splice(2);
const Interactive = Parameters.includes("--interactive") || Parameters.includes("--Interactive");
const setup = Chalk.whiteBright.bold("Initializing");
console.log("[Log]" + " " + setup + " " + "IaC Package ... ", "\n");
await Utility.Distribution.directory(Path.join(Process.cwd(), "ci"));
await Utility.CDKTF.generate();
await Utility.Package.reconfigure();
await Utility.Main.hydrate();
await Utility.Typescript.create();
Process.chdir(Path.join(Process.cwd(), "ci"));
Process.stdout.write("\n");
const installation = Chalk.magentaBright.bold("Installing");
console.log("[Log]" + " " + installation + " " + "Dependencies ... ");
await Utility.Spawn("npm install --no-fund .");
Process.stdout.write("\n");
const constructs = Chalk.greenBright.bold("Downloading");
console.log("[Log]" + " " + constructs + " " + "Constructs + Provider(s) ... ");
await Utility.Spawn("npm run get");
Process.stdout.write("\n");
const compilation = Chalk.yellowBright.bold("Compiling");
console.log("[Log]" + " " + compilation + " " + "TypeScript ➔ JavaScript ... ");
await Utility.Spawn("npm run build");
Process.stdout.write("\n");
switch (Interactive) {
    case true: {
        const initialize = Chalk.cyanBright.bold("Running");
        console.log("[Log]" + " " + initialize + " " + Chalk.italic("Interactive") + " " + "First-Time Setup");
        await Utility.Spawn("npm run initialize -- --reconfigure");
        break;
    }
    case false: {
        const initialize = Chalk.redBright.underline.bold("cd ./ci && npm run initialize");
        console.log(Chalk.bold("Lastly") + "," + " " + Chalk.italic("Execute the Following to Finish Setup"));
        console.log("  ↳ " + initialize);
        break;
    }
}
Process.stdout.write("\n");
Process.chdir(CWD);
export default {};
//# sourceMappingURL=index.js.map