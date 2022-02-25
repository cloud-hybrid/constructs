import type { HTTP } from "..";

interface Options {
    error?: string;
    status?: string;
    code?: number;

    message?: string;
}

class Options implements Options {
    error?: string;
    status?: string;
    code?: number;

    message?: string;

    constructor(error?: string, status?: string, code?: number, message?: string) {
        this.error = error;
        this.status = status;
        this.code = code;

        this.message = message;
    }
}

/***
 * @example
 * const error = {};
 * const exception = Error.Exception.initialize(request, response, error);
 * await exception.send();
 *
 * @example
 * const error = {
 *     message: "JWT Required as Input"
 * };
 *
 * const exception = Error.Exception.initialize(request, response, error);
 * await exception.send();
 *
 * @example
 * // const error = {
 * //     message: "JWT Required as Input",
 * //     error: "Authorization-Not-Found-Exception",
 * //     status: 422
 * // };
 *
 * const error = {
 *     message: "JWT Required as Input",
 *     error: "Authorization-Not-Found-Exception"
 * };
 *
 * const exception = Error.Exception.initialize(request, response, error);
 * await exception.send();
 *
 * // const error = {
 * //     message: "JWT Required as Input",
 * //     error: "Authorization-Not-Found-Exception",
 * //     status: 422
 * // };
 *
 * // const error = {
 * //     message: "JWT Required as Input",
 * //     error: "Authorization-Not-Found-Exception"
 * // };
 *
 * // const error = {
 * //     message: "JWT Required as Input"
 * // };
 *
 * const error = {};
 * const exception = Error.Exception.initialize(request, response, error);
 * await exception.send();
 *
 */

class Exception implements Options {
    private static readonly type: string = "Application/JSON";
    private static readonly keepAlive: boolean = false;
    private static readonly encoding: BufferEncoding = "utf-8";
    private static readonly error: string = "Client-API-Error";
    private static readonly status: string = "Exception";
    private static readonly timeout: number = 5000;
    private static readonly date: boolean = true;
    private static readonly code: number = 400;
    private static readonly message: string = null;

    protected request: HTTP["Request"];
    protected response: HTTP["Response"];

    error?: string;
    status?: string;
    code?: number;

    message?: string;

    protected constructor( server: [HTTP["Request"], HTTP["Response"]], exception?: Options ) {
        /*** Response Body Composition */
        this.error = exception?.error ?? Exception.error;
        this.status = exception?.status ?? Exception.status;
        this.code = exception?.code ?? Exception.code;
        this.message = exception?.message ?? Exception.message;

        /*** Server Request + Response */
        this.request = server[0];
        this.response = server[1];
    }

    /***
     * Exception Initializer
     * ---
     *
     * @param {Options} exception
     * @param {Request} request
     * @param {Response} response
     *
     * @returns {Exception}
     *
     */
    public static initialize(request: HTTP["Request"], response: HTTP["Response"], exception?: Options): Exception {
        return new Exception([request, response], exception);
    }

    public async send (headers?: HTTP["Headers"]) {
        /// console.debug("[Debug]", this.request);

        const keys = Object.keys(headers || {});
        keys.forEach( $ => {
            this.response.setHeader( $, headers[$] );
        } );

        const body = JSON.stringify({
            Error: this.error,
            Message: this.message,
            Status: [this.code, this.status]
        });

        /*** Response Strict Defaults */
        this.response.setHeader("Content-Type", Exception.type);

        this.response.setTimeout(Exception.timeout);

        this.response.shouldKeepAlive = Exception.keepAlive;
        this.response.sendDate = Exception.date;

        this.response.statusMessage = this.status;

        this.response.writeHead(this.code ?? Exception.code);

        /// HTTP(s) Response
        this.response.write(body);

        this.response.end();
    }
}

export { Exception, Options };

export default Exception;
