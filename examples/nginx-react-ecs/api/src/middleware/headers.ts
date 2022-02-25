/*** Default Headers
 * @type {[{Value: string, Key: string}, {Value: string, Key: string}]}
 */

const Overwrites = [
    {
        Key: "Server",
        Value: "Nexus-API"
    },
    {
        Key: "X-Powered-By",
        Value: "Cloud-Technology"
    }
];

import { Application } from "..";

type Server = typeof Application;

type Generic = any;

export const Headers = (server: Server | Generic, headers = Overwrites) => {
    console.debug("[Headers] [Debug] Instantiating Header(s)");

    const $ = (_: Generic, response: Generic, callback: Generic) => {
        headers.forEach((Element) => {
            response.setHeader(Element.Key, Element.Value);
        });

        callback();
    };

    console.debug("[Headers] [Debug] Setting Header Overwrite(s)");

    server.use($);

    console.debug("[Headers] [Debug] Enabled Custom Response Headers");

};

export default Headers;