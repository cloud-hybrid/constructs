import HTTP from "http";

type Request = HTTP.IncomingMessage;
/// type Response = HTTP.ServerResponse;

type Incoming = HTTP.IncomingMessage;
type Listener = HTTP.RequestListener;
type Options = HTTP.RequestOptions;

type Asynchronous = ( request: Request, response: Response ) => Promise<Symbol>;

interface Inbound extends HTTP.ClientRequest {}

interface Response extends HTTP.ServerResponse, HTTP.OutgoingMessage {}

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

declare interface HTTP {
    Request: Request;
    Response: Response;
    Listener: Listener;
    Options: Options;
    Asynchronous: Asynchronous;
    Headers: Headers;
}

export type { HTTP };