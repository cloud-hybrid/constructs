/***
 * @module Logging
 */

import { Application } from "..";
import { Logger } from "../library/logger";

//const logger = require('pino-http')({
//    quietReqLogger: true, // turn off the default logging output
//    transport: {
//        target: 'pino-http-print', // use the pino-http-print transport and its formatting output
//        options: {
//            destination: 1,
//            all: true,
//            translateTime: true
//        }
//    }
//})

type Generic = any;
type Server = typeof Application;

const Logging = (server: Server | Generic) => {
    console.debug("[Logging] [Debug] Instantiating HTTP Logger");

    server.use(Logger);

    console.log(server);

    console.debug("[Logging] [Debug] Enabled Custom HTTP Logging");
};

export default Logging;

export { Logging };