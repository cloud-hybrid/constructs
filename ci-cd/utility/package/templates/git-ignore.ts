import { Main, Raw } from "../index.js";

/***
 * Extension of {@link Raw}
 */

class Ignore extends Raw {
    /***
     * @see {@link Raw}
     */

    constructor() {
        super( import.meta.url /* __filename */, "tpl", ".gitignore" );
    }

    /***
     * @see {@link Raw.hydrate}
     */

    async hydrate() {
        await super.populate();
    }
}

export { Ignore };

export default Ignore;

/// module.exports = { Ignore };
