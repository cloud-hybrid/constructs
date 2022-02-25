/*** Compression
 * @module Compression
 */

import { Application } from "..";

type Server = typeof Application;

import { Socket } from "../library";

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

export const WS = (server: Server | Generic) => {
    Socket(Application, server);
    console.debug("[Socket] [Debug] Websocket Enabled");
    return server;
};
