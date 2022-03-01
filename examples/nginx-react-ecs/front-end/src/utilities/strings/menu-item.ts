/***
 * Menu Item Path Normalization
 * ---
 *
 * @param input {string} Singleton Requirement
 * @param inputs {string[]} Additional String(s)
 *
 * @returns {string}
 *
 */

function formalize( input: string, ...inputs: string[] | undefined | null ): string {
    const Input = ( inputs ) ? [ input, [ ...inputs ].join(" ") ].join(" ") : input;
    const Root = String("/" + Input.toString()[ 0 ].toLowerCase() + Input.toString().slice(1)).trim();

    const URI = Root.split(" ").map(( $ ) => {
        return $.toString().toLowerCase()
    }).join("/").split("_").map(( $ ) => {
        return $.toString().toLowerCase()
    }).join("/").split("-").map(( $ ) => {
        return $.toString().toLowerCase()
    }).join("/");

    console.debug("[Debug] (Pathing-Normalization)", Root, URI);

    return ( inputs.length > 0 ) ? URI : Root;
}

export { formalize };

export default formalize;