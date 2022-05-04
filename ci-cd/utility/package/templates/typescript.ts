import { Main, Raw } from "../index.js";

/***
 * Extension of {@link Raw}
 */

class Typescript extends Raw {
    /***
     * @see {@link Raw}
     */

    constructor() {
        super( import.meta.url /* __filename */, "json", "tsconfig.json" );
    }

    /***
     * @see {@link Raw.hydrate}
     */

    async hydrate() {
        await super.populate();
    }
}

export { Typescript };

export default { Typescript };

/// module.exports = { Typescript };
