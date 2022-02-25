import Module from "module";

const URL = import.meta.url.replace("file://", "");

/***
 * Node.js `require` via ESM Modules
 *
 * @type {NodeRequire} Require
 *
 */

const Import = Module.createRequire(URL);

/***
 * Numerical Status Codes
 *
 * @type {{"100": string, "101": string, "102": string, "103": string, "200": string, "201": string, "202": string, "203": string, "204": string, "205": string, "206": string, "207": string, "208": string, "226": string, "300": string, "301": string, "302": string, "303": string, "304": string, "305": string, "307": string, "308": string, "400": string, "401": string, "402": string, "403": string, "404": string, "405": string, "406": string, "407": string, "408": string, "409": string, "410": string, "411": string, "412": string, "413": string, "414": string, "415": string, "416": string, "417": string, "418": string, "421": string, "422": string, "423": string, "424": string, "425": string, "426": string, "428": string, "429": string, "431": string, "451": string, "500": string, "501": string, "502": string, "503": string, "504": string, "505": string, "506": string, "507": string, "508": string, "509": string, "510": string, "511": string}}
 */

const Codes = Import("./status-code.json");

/***
 * Named Status Codes
 *
 * @type {{Continue: number, "Switching-Protocols": number, Processing: number, "Early-Hints": number, OK: number, Created: number, Accepted: number, "Non-Authoritative-Information": number, "No-Content": number, "Reset-Content": number, "Partial-Content": number, "Multi-Status": number, "Already-Reported": number, "IM-Used": number, "Multiple-Choices": number, "Moved-Permanently": number, Found: number, "See-Other": number, "Not-Modified": number, "Use-Proxy": number, "Temporary-Redirect": number, "Permanent-Redirect": number, "Bad-Request": number, Unauthorized: number, "Payment-Required": number, Forbidden: number, "Not-Found": number, "Method-Not-Allowed": number, "Not-Acceptable": number, "Proxy-Authentication-Required": number, "Request-Timeout": number, Conflict: number, Gone: number, "Length-Required": number, "Precondition-Failed": number, "Payload-Too-Large": number, "URI-Too-Long": number, "Unsupported-Media-Type": number, "Range-Not-Satisfiable": number, "Expectation-Failed": number, "I'm-a-Teapot": number, "Misdirected-Request": number, "Unprocessable-Entity": number, Locked: number, "Failed-Dependency": number, "Too-Early": number, "Upgrade-Required": number, "Precondition-Required": number, "Too-Many-Requests": number, "Request-Header-Fields-Too-Large": number, "Unavailable-For-Legal-Reasons": number, "Internal-Server-Error": number, "Not-Implemented": number, "Bad-Gateway": number, "Service-Unavailable": number, "Gateway-Timeout": number, "HTTP-Version-Not-Supported": number, "Variant-Also-Negotiates": number, "Insufficient-Storage": number, "Loop-Detected": number, "Bandwidth-Limit-Exceeded": number, "Not-Extended": number, "Network-Authentication-Required": number}}
 */

const Statuses = Import("./named-status-code.json");

export { Codes, Statuses };

export default { Codes, Statuses };