
import { Parser } from "../library";

import { Application } from "..";

type Server = typeof Application;

const Parsers = {
    "URL-Encoded": {
        Module: Parser.urlencoded,
        Parameters: {
            extended: true,
            parameterLimit: 1000
        }
    }, JSON: {
        Module: Parser.json,
        Parameters: {
            strict: true
        }
    }
};

type Generic = any;

/*** Body Middleware Loader
 *
 * @param server {Application}
 *
 * @param parsers {Parsers}
 *
 * @return {Application}
 *
 * @constructor
 *
 */

export const Body = (server: Server | Generic, parsers = Parsers) => {
    console.debug("[Body-Parser] [Debug] Initializing Body Parser(s)");

    Object.keys(parsers).forEach((Parser) => {
        console.debug("[Body-Parser] [Debug] Instantiating" + " " + Parser + " " + "Parser");

        // @ts-ignore
        const Function = parsers[Parser].Module;

        // @ts-ignore
        const Parameters = parsers[Parser].Parameters;

        console.debug("[Body-Parser] [Debug] Parameters" + ":", Parameters);

        server.use(Function(Parameters));

        console.debug("[Body-Parser] [Debug] Updated Application Request + Response Parser(s)");
    });

    return server;
};

export default Body;