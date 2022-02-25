import { Raw } from "../index.js";

/***
 * Extension of {@link Raw}
 */

class CDKTF extends Raw {
    /***
     * @see {@link Raw}
     */

    constructor() {
        super( import.meta.url, "json", null );
    }

    /***
     * @see {@link Raw.hydrate}
     */

    async hydrate() {
        await super.populate();
    }
}

export { CDKTF };

export default CDKTF;
