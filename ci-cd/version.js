#!/usr/bin/env node
/***
 * Semantic Versioning
 * ---
 *
 * Usage: $ semantic-version --increment [ --patch | --minor | --major ] ? [ --write ]
 *
 * @returns Signal(0)
 *
 */
const Version = {
    Target: {
        Patch: "",
        Minor: "",
        Major: ""
    },
    Current: {
        Patch: "",
        Minor: "",
        Major: ""
    },
};
const Datetime = new Date();
// --> Standard-Library
import Process from "process";
import Path from "path";
import FS from "fs";
const CWD = Process.cwd();
const PWD = import.meta.url.replace("file://", "");
const Subprocess = await import("./utility/subprocess.js").then(($) => $.default);
const CLI = Process.argv;
const Parameters = CLI.splice(2);
const Entry = Process.env.npm_package_json ?? Path.join(CWD, "package.json") ?? Path.join(PWD, "package.json");
console.info("[DEBUG]", "➜" + " " + "Entry" + ":", Entry);
const Handler = FS.readFileSync(Entry, { encoding: "utf-8" });
console.info("[DEBUG]", "➜" + " " + "CWD" + ":", CWD);
const Data = JSON.parse(Handler);
const Today = Datetime.toISOString().slice(0, 10);
console.info("[DEBUG]", "➜" + " " + "Date" + ":" + " " + Today);
if (Parameters.includes("--Increment") || Parameters.includes("--increment")) {
    const Current = Data.version.split(".");
    Version.Current.Major = Current[0];
    Version.Current.Minor = Current[1];
    Version.Current.Patch = Current[2];
    const Major = () => {
        Version.Target.Major = String(Number(Version.Current.Major) + 1);
        Version.Target.Minor = String(Version.Current.Minor);
        Version.Target.Patch = String(Version.Current.Patch);
    };
    const Minor = () => {
        Version.Target.Major = String(Version.Current.Major);
        Version.Target.Minor = String(Number(Version.Current.Minor) + 1);
        Version.Target.Patch = String(Version.Current.Patch);
    };
    const Patch = () => {
        Version.Target.Major = String(Version.Current.Major);
        Version.Target.Minor = String(Version.Current.Minor);
        Version.Target.Patch = String(Number(Version.Current.Patch) + 1);
    };
    (Parameters.includes("--Major") || Parameters.includes("--major"))
        ? Major() : console.debug("[DEBUG]"
        + " ➜ Skipping Major Incrementor");
    (Parameters.includes("--Minor") || Parameters.includes("--minor"))
        ? Minor() : console.debug("[DEBUG]"
        + " ➜ Skipping Minor Incrementor");
    (Parameters.includes("--Patch") || Parameters.includes("--patch"))
        ? Patch() : console.debug("[DEBUG]"
        + " ➜ Skipping Patch Incrementor");
    console.debug("[DEBUG] ➜ Version "
        + String(Version.Current.Major)
        + "."
        + String(Version.Current.Minor)
        + "."
        + String(Version.Current.Patch)
        + " >>> "
        + String(Version.Target.Major)
        + "."
        + String(Version.Target.Minor)
        + "."
        + String(Version.Target.Patch));
}
switch (Parameters.includes("--Write") || Parameters.includes("--write")) {
    case true: {
        Data.version = String(String(Version.Target.Major)
            + "."
            + String(Version.Target.Minor)
            + "."
            + String(Version.Target.Patch));
        FS.writeFileSync(Entry, JSON.stringify(Data, null, 4));
        console.debug("[DEBUG] ➜ Successfully Wrote to Package Index");
        await Subprocess("npm run upload");
        Process.exit(0);
        break;
    }
    default:
        break;
}
//# sourceMappingURL=version.js.map