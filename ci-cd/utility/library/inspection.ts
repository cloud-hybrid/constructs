import Utility from "util";

/***
 * Inspection Serialization for Standard-Output
 * ---
 *
 * @param {string} input - The Context or Handler response awaitable
 *
 * @constructor
 *
 */

const Inspect = async (input: string) => {
    try {
        const $ = Utility.inspect( JSON.parse( input ), { showProxy: true, showHidden: true, colors: true } );

        console.debug( "[Debug] Serialized Inspection Result(s)" + ":", $ );
    } catch ( error ) {
        const $ = Utility.inspect( input, { showProxy: true, showHidden: true, colors: true } );

        console.debug( "[Debug] Inspection Result(s)" + ":", $ );
    }
}

export { Inspect };
export default Inspect;