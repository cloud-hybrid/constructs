import Path from "path";
import Utility from "util";
import Process from "process";
import FS from "fs";

import { Remove } from ".";

const Data = {
    $: "test-remove-target-directory",
    0: () => Data.File("0.json"),
    Directory: () => Path.join(Process.cwd(), Data[ "$" ]),
    File: (file) => Path.join(Data.Directory(), file)
};

const Main = async () => {
    const $ = Utility.promisify(FS.exists);

    FS.mkdirSync(Data.Directory());
    for ( const $ in new Array(25).fill(Number) ) {
        FS.writeFileSync(Data.File([ $, "json" ].join(".")),
            JSON.stringify({
                Name: String($)
            }));
    }

    const contents = FS.readdirSync(Data.Directory());

    console.debug("[Debug]", "Unit-Test (Remove) Directory Contents" + ":", contents);

    test("Singleton (Remove) Unit-Test", async () => {
        await Remove(Data["0"]());

        const Singleton = Data["0"]();
        const Evaluation = await $(Singleton);

        console.debug("[Debug]", "Singleton Existence" + ":", Path.basename(Singleton), Evaluation);

        expect(Evaluation).toBe(false);
    });

    test("Recursive (Remove) Unit-Test", async () => {
        await Remove(Data.Directory());

        const Directory = Data.Directory();
        const Evaluation = await $(Directory);

        console.debug("[Debug]", "Directory Existence" + ":", Path.basename(Directory), Evaluation);

        expect(Evaluation).toBe(false);
    });
};

(async () => await Main())();
