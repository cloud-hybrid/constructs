/***
 * Name Normalization
 * ------------------
 * Takes any given input, and generates a machine-readable,
 * normalized, title-traincase'd string.
 *
 * @param input {string} Singleton Requirement
 * @param inputs {string[]} Additional String(s)
 *
 * @returns {string}
 *
 */

function normalize( input: string, ...inputs: string[] | undefined | null ): string {
    const Input = ( inputs ) ? [ input, [ ...inputs ].join(" ") ].join(" ") : input;

    return Input.split(" ").map(( $ ) => {
        return $.toString()[ 0 ].toUpperCase() + $.toString().slice(1);
    }).join("-").split("_").map(( $ ) => {
        return $.toString()[ 0 ].toUpperCase() + $.toString().slice(1);
    }).join("-").split("-").map(( $ ) => {
        return $.toString()[ 0 ].toUpperCase() + $.toString().slice(1);
    }).join("-");
}

const Normalize = normalize;

export { normalize, Normalize };

export default normalize;