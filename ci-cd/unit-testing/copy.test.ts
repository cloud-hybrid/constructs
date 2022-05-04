import Path from "path";
import Process from "process";
import Utility from "util";
import FS from "fs";

import { Copy } from ".";

const Clean = async () => {
    const $ = Utility.promisify(FS.rm);

    await $(Path.join(Process.cwd(), "test-target-directory"), {
        force: true,
        maxRetries: 3,
        recursive: true,
        retryDelay: 250
    });
};

const Main = async () => {
    test.skip("Copy Unit-Test", async () => {
        const $ = Utility.promisify(FS.exists);

        await Copy("node_modules", "test-target-directory");

        expect(await $(Path.join(Process.cwd(), "test-target-directory"))).toBe(true);
    });

    test.skip("Clean-Up", async () => {
        const $ = Utility.promisify(FS.exists);

        await Clean();

        expect(await $(Path.join(Process.cwd(), "test-target-directory"))).toBe(false);
    });
};

(async () => await Main())();
