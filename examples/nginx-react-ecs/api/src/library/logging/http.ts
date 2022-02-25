import Default from "pino";

import { v4 as UUID } from "uuid";

import Log from "pino-http";

import { IncomingMessage, ServerResponse } from "http";

// @ts-ignore
const Configuration = Log( {
    // @ts-ignore
    logger: Default( { sync: false } ),

    // @ts-ignore
    genReqId: function (... request) {
        return UUID().toUpperCase();
    },

    // Define custom serializers
    serializers: {
        err: Default.stdSerializers.err,
        req: Default.stdSerializers.req,
        res: Default.stdSerializers.res
    },

    // Set to `false` to prevent standard serializers from being wrapped.
    wrapSerializers: true,

    // useLevel: "verbose",
    // Define a custom logger level
    customLogLevel: function (res, err) {
        if ( res.statusCode >= 400 && res.statusCode < 500 ) {
            return "warn";
        } else {
            if ( res.statusCode >= 500 || err ) {
                return "error";
            } else {
                return "info";
            }
        }
    },

    // Define a custom success message
    customSuccessMessage: function (res) {
        if ( res.statusCode === 404 ) {
            return "Resource Not Found";
        }

        return "OK";
    },

    // Define a custom receive message
    customReceivedMessage: function (req, _res) {
        const headers = req.headers;

        const keys = Object.keys( headers ).filter( ($) => RegExp( ".*(X)|(Server)|(Authorization)|(Username)|(Password)|(Token)|(Host)|(JWT)|(Grant).*", "i" ).exec( $ ) );

        const container = {};

        keys.forEach( ($) => {
            // @ts-ignore
            container[$] = headers[$];
        } );

        const host = headers["host"];
        const accept = headers["accept"];
        const agent = headers["user-agent"];

        // @ts-ignore
        headers["user-agent"] = null;

        // @ts-ignore
        headers["accept"] = null;

        return {
            request: {
                method: req.method,
                headers: container
                //            agent: agent
            }
        };
    },

    // @ts-ignore
    customErrorMessage: function (err, res) {
        return "Request err (" + res.statusCode + ")";
    },

    // Override attribute keys for the log object
    customAttributeKeys: {
        responseTime: "duration",
        req: "request",
        res: "response",
        err: "error"
    },

    // ts-ignore
    customProps: function (request: { customProp: any; }, res: { locals: { myCustomData: any; }; }) {
        return {
            customProp: request.customProp,
            // user request-scoped data is in res.locals for express applications
            express: res.locals.myCustomData
        };
    }
} );

function Handler(server: { use: (arg0: (request: any, res: any, callback: any) => void) => void; }) {
    const $ = (request: IncomingMessage, res: ServerResponse, callback: () => void) => {
        Configuration( request, res );

        callback();
    };

    server.use( $ );
}

const $ = Default.destination({ sync: false });

const Logger = Default($);

export { Handler, Logger };

export default Logger;