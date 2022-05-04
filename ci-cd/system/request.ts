/***
 * Standard Node.js Library -- GET & POST
 *
 * @example
 * import * as HTTPs from "...";
 *
 * const postable = await HTTPs.post("https://jsonplaceholder.typicode.com/posts", JSON.stringify({
 *     title: "Test-Title",
 *     body: "Content",
 *     userId: 0
 * }), {});
 *
 * console.log("[Log] POST Request", postable);
 *
 * const gettable = await HTTPs.get("https://jsonplaceholder.typicode.com/posts/1", {});
 *
 * console.log("[Log] GET Request", gettable);
 *
 */

import URI from "url";

import HTTPs from "https";

type Headers = { [$: string]: string };

/***
 * `GET` HTTP Request
 * ---
 *
 * Please do not use directly; see {@link get} for usage.
 *
 * @param {string} uri
 * @param {{}} headers
 * @param {Function} resolve
 * @param {Function} reject
 * @constructor
 *
 */

const GET = ( uri: string, headers: Headers = {}, resolve: Function, reject: Function ) => {
    const $: { body: Buffer | string | null, data: string, headers: { request: {}, response: {} } } = { body: "", data: "", headers: { request: {}, response: {} } };

    const options = {
        ... {
            protocol: "https" + ":",
            port: 443,
            rejectUnauthorized: false,
            requestCert: true,
            followAllRedirects: true,
            encoding: "utf-8",
            agent: false,
            method: "GET",
            headers: { ... { "Content-Type": "application/json" }, ... headers }
        }, ... URI.urlToHttpOptions( new URI.URL( uri ) )
    };

    $.headers.request = { ... { "Content-Type": "application/json" }, ... headers };

    options.headers = { ... $.headers.request };

    const request = HTTPs.request( options, ( response ) => {
        /// HTTP Redirect(s)
        if ( response.statusCode === 301 || response.statusCode === 302 ) {
            return GET( response.headers.location as string, headers, resolve, reject );
        }

        $.headers.response = response.headers;

        response.on( "error", ( error ) => {
            reject( error );
        } );

        response.on( "data", ( chunk ) => {
            $.body += Buffer.from( chunk ).toString( "utf-8" );
        } );

        response.on( "end", () => {
            $.headers.response = response.headers;

            try {
                $.data = JSON.parse( String( $.body ) );
            } catch ( e ) {
                console.warn( "[Warning] Unable to Parse Body" );
                console.trace( "[Error] Error Object" + ":", e );
                /// throw e;

                $.data = String( $.body );
            }
        } );
    } );

    request.on( "error", ( error ) => {
        reject( error );
    } );

    request.on( "close", () => {
        resolve( $ );
    } );

    request.end();
};

/***
 * `POST` HTTP Request
 * ---
 *
 * Please do not use directly; see {@link post} for usage.
 *
 * @param {string} uri
 * @param {string} data
 * @param {{}} headers
 * @param {Function} resolve
 * @param {Function} reject
 * @constructor
 */
const POST = ( uri: string, data: string, headers = {}, resolve: Function, reject: Function ) => {
    const $: { body: string[], data: string, headers: { request: {}, response: {} } } = { body: [], data: "", headers: { request: {}, response: {} } };

    const options = {
        ... {
            protocol: "https" + ":",
            port: 443,
            rejectUnauthorized: false,
            requestCert: true,
            followAllRedirects: true,
            encoding: "utf-8",
            agent: false,
            method: "POST",
            headers: {
                ... {
                    "Content-Type": "application/json", "Content-Length": Buffer.byteLength( data )
                }, ... headers
            }
        }, ... URI.urlToHttpOptions( new URI.URL( uri ) )
    };

    options.headers = { ... options.headers, ... headers };

    $.headers.request = options.headers;

    const request = HTTPs.request( options, ( response ) => {
        if ( response.statusCode === 301 || response.statusCode === 302 ) {
            return POST( response.headers.location as string, data, headers, resolve, reject );
        }

        response.on( "data", ( chunk ) => {
            $.body?.push( Buffer.from( chunk ).toString( "utf-8" ) );
        } );

        response.on( "end", () => {
            $.headers.response = response.headers;

            try {
                $.data = JSON.parse( $.body.join() );
            } catch ( e ) {
                console.warn( "[Warning] Unable to Parse Body" );
                console.trace( "[Error] Error Object" + ":", e );
                /// throw e;

                $.data = String( $.body.join() );
            }
        } );
    } );

    request.on( "error", ( error ) => {
        reject( error );
    } );

    request.on( "close", () => {
        resolve( $ );
    } );

    request.write( data );

    request.end();
};

/***
 * `GET` HTTP Request Interface
 *
 * @param {string} url
 * @param {Headers} headers
 *
 * @returns {Promise<{body: string[], data: string}>}
 */

const get = ( url: string, headers: Headers ): Promise<{ body: string[], data: string }> => {
    return new Promise( ( resolve, reject ) => {
        GET( url, headers, resolve, reject );
    } );
};

/***
 * `POST` HTTP Request Interface
 *
 * @param {string} url
 * @param {string} data
 * @param {Headers} headers
 *
 * @returns {Promise<{body: string[], data: string}>}
 */

const post = ( url: string, data: string, headers: Headers ): Promise<{ body: string[], data: string }> => {
    return new Promise( ( resolve, reject ) => {
        POST( url, data, headers, resolve, reject );
    } );
};

export { get, post };

export default { get, post };

export type { Headers };

module.exports = { get, post };
