import FS from "fs";
import http from "http";
import https from "https";

import URI from "url";

import * as Assert from "assert";

import { Signer } from "./signer.js";

/** The location (URL) of the object it is linked to. Changes done on it are reflected on the object it relates to. Both the Document and Window interface have such a linked Location, accessible via Document.location and Window.location respectively. */
interface Location {
    /** Returns a DOMStringList object listing the origins of the ancestor browsing contexts, from the parent browsing context to the top-level browsing context. */
    readonly ancestorOrigins: string[];
    /**
     * Returns the Location object's URL's fragment (includes leading "#" if non-empty).
     *
     * Can be set, to navigate to the same URL with a changed fragment (ignores leading "#").
     */
    hash: string;
    /**
     * Returns the Location object's URL's host and port (if different from the default port for the scheme).
     *
     * Can be set, to navigate to the same URL with a changed host and port.
     */
    host: string;
    /**
     * Returns the Location object's URL's host.
     *
     * Can be set, to navigate to the same URL with a changed host.
     */
    hostname: string;
    /**
     * Returns the Location object's URL.
     *
     * Can be set, to navigate to the given URL.
     */
    href: string;
    toString(): string;
    /** Returns the Location object's URL's origin. */
    readonly origin: string;
    /**
     * Returns the Location object's URL's path.
     *
     * Can be set, to navigate to the same URL with a changed path.
     */
    pathname: string;
    /**
     * Returns the Location object's URL's port.
     *
     * Can be set, to navigate to the same URL with a changed port.
     */
    port: string;
    /**
     * Returns the Location object's URL's scheme.
     *
     * Can be set, to navigate to the same URL with a changed scheme.
     */
    protocol: string;
    /**
     * Returns the Location object's URL's query (includes leading "?" if non-empty).
     *
     * Can be set, to navigate to the same URL with a changed query (ignores leading "?").
     */
    search: string;
    /** Navigates to the given URL. */
    assign(url: string | URI.URL): void;
    /** Reloads the current page. */
    reload(): void;
    /** Removes the current page from the session history and navigates to the given URL. */
    replace(url: string | URI.URL): void;
}

class Stream extends Signer {
    private static stream = ($: Location) => FS.createWriteStream( String( $ ) );

    constructor(expiration: number = 300) {
        super(expiration);
    }

    protected async download(local: Descriptor | Generic) {
        const method = "GET";

        const protocol = !this?.url?.charAt( 4 )
            .localeCompare( "s" ) ? https : http;
        const file = Stream.stream( local );
        const data: Object | Generic = { response: null, request: null, total: 0 };

        Assert.notEqual(this.settings, undefined);
        const $: Promise<Generic> = new Promise( (resolve, reject) => {
            const request = protocol.get( this.settings, response => {
                if ( response.statusCode !== 200 ) {
                    reject( new Error( JSON.stringify( {
                        error: true,
                        settings: this.settings,
                        status: response.statusMessage,
                        code: response.statusCode
                    }, null, 4 ) ) );

                    return;
                }

                data.request = this.settings;

                data.response = {
                    method: method,
                    headers: response.headers,
                    http: response.httpVersion,
                    status: {
                        code: response.statusCode,
                        message: response.statusMessage
                    }
                };

                response.pipe( file );
            } );

            file.on( "finish", () => {
                resolve( data );
            } );

            request.on( "error", (error) => {
                FS.unlink( local, () => reject( error ) );
            } );

            request.on( "response", ($: import("http").IncomingMessage | Generic) => {
                data.total = Number.parseInt( $.headers["content-length"], 10 );
            } );

            file.on( "error", (error) => {
                FS.unlink( local, () => reject( error ) );
            } );

            request.end();
        } );

        return data;
    }
}

type Generic = any;

type Descriptor = FS.PathOrFileDescriptor | FS.PathLike | string | null | undefined;

export { Stream };

export default Stream;
