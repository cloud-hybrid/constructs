/***
 * Cloud Resource Name Title-Casing
 * ---
 *
 * Takes any given prefix, a resource name, and generates a machine-readable, normalized string
 *
 * @param input {string} ex) API-Gateway-V2-Integration
 *
 * @returns {string}
 *
 */

function Normalize(input: string) {
    input = (input !== "") ? input : "[N/A]";

    return input.split( " " ).map( ($) => {
        return $.toString()[0].toUpperCase() + $.toString().slice( 1 );
    } ).join( "-" ).split( "_" ).map( ($) => {
        return $.toString()[0].toUpperCase() + $.toString().slice( 1 );
    } ).join( "-" ).split( "-" ).map( ($) => {
        return $.toString()[0].toUpperCase() + $.toString().slice( 1 );
    } ).join( "-" ).replace(".", "");
}

export { Normalize };

export default Normalize;