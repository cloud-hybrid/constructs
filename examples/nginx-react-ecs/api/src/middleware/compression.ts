/*** Compression
 * @module Compression
 */

import { Application } from "..";

type Server = typeof Application;

import { Compression } from "../library";

type Generic = any;

/*** Compression Middleware Loader
 *
 * @param server {Application}
 *
 * @returns {Application}
 *
 * @constructor
 *
 */

export const Compress = (server: Server | Generic) => {
    console.debug("[Compression] [Debug] Setting Compression Configuration(s)");
    server.use(Compression());
    console.debug("[Compression] [Debug] Compression has been Enabled");

    return server;
};