import HTTP             from "http";

type Request = HTTP.IncomingMessage;
type Response = HTTP.ServerResponse;
type Listener = HTTP.RequestListener;

interface Inbound extends HTTP.ClientRequest {};
interface Outbound extends Response, HTTP.OutgoingMessage {};

type Asynchronous = (request: HTTP.IncomingMessage, response: Outbound) => Promise<Symbol>;

/***
 * A mapping of header names to string values.
 *
 * Keys should be considered case insensitive, even if this is not enforced by a
 * particular implementation.
 *
 */
interface Headers {
    [header: string]: string;
}

const Schema = ( verification, data, token, error ) => {
    return {
        Verification: verification,
        Serialization: data,
        Token: { JWT: token },
        Error: error
    };
};

interface Server {
    request: Request;
    response: Response;
}

interface Options {
    error: string;
    message: string;
    status: number;
}

interface JWT extends Options {
    realm: "Nexus";
}

class Exception implements Options {
    private static readonly type: string = "Application/JSON";
    private static readonly keepAlive: boolean = false;
    private static readonly encoding: BufferEncoding = "utf-8";
    private static readonly status: string = "Exception";
    private static readonly timeout: number = 5000;
    private static readonly date: boolean = true;

    protected request: Request;
    protected response: Response;

    error: string;
    message: string;
    status: number;

    private constructor( exception: Options, server: [Request, Response] ) {
        /*** Response Body Composition */
        this.error = exception.error;
        this.message = exception.message;
        this.status = exception.status;

        /*** Server Request + Response */
        this.request = server[0];
        this.response = server[1];
    }

    /***
     * Exception Initializer
     * ---
     *
     * @param {Exception} exception
     * @param {Request} request
     * @param {Response} response
     *
     * @returns {Exception}
     */
    public static initialize(exception: Options, request: Request, response: Response) {
        return new Exception(exception, [request, response]);
    }

    public async send (headers?: Headers) {
        /// console.debug("[Debug]", this.request);

        const keys = Object.keys(headers || {});
        for (let header in keys) {
            const $ = keys[header];
            this.response.setHeader($, headers[$]);
        }

        const body = JSON.stringify({
            Error: this.error,
            Message: this.message,
            Status: [Exception.status, this.status]
        });

        /*** Response Strict Defaults */
        this.response.setHeader("Content-Type", Exception.type);

        this.response.setTimeout(Exception.timeout);

        this.response.shouldKeepAlive = Exception.keepAlive;
        this.response.statusMessage = Exception.status;
        this.response.sendDate = Exception.date;

        this.response.writeHead(this.status);

        /// HTTP(s) Response
        this.response.write(body);

        this.response.end();
    }
}

export { Exception };

export default Exception;
