import { HTTP, Schemes } from "..";

import { Exception } from ".";
import { Options }   from ".";

class Base extends Exception implements Options {
    readonly #code = 401;
    readonly #error = "JWT-Exception";
    readonly #status = "Unauthorized";
    readonly #message = "A JWT Error Occurred";

    public static authentication = Schemes.Bearer;

    public realm?: string | null = null;

    protected constructor( server: [ HTTP["Request"], HTTP["Response"] ], exception?: Options ) {
        super( server, exception );

        this.code = (exception?.code) ? exception.code : this.#code;
        this.error = (exception?.error) ? exception.error : this.#error;
        this.status = (exception?.status) ? exception.status : this.#status;

        this.response.statusCode = (this.code) ? this.code : this.#code;
        this.response.statusMessage = (this.status) ? this.status : this.#status;

        this.message = (exception?.message) ? exception.message : this.#message;
    }

    /***
     * @param {HTTP["Headers"]} headers
     *
     * @returns {Promise<void>}
     */
    public async send( headers?: HTTP["Headers"]) {
        await super.send( {
            ... headers
        } );
    }

    /***
     * Exception Initializer
     * ---
     *
     * @param {Options} exception
     * @param {Request} request
     * @param {Response} response
     *
     * @returns {Base}
     *
     */
    public static initialize(request: HTTP["Request"], response: HTTP["Response"], exception: Options): Base {
        return new Base([request, response], exception);
    }
}

class Malformation extends Base implements Options {
    readonly #code = 401;

    readonly #error = "JWT-Malformation-Exception";
    readonly #status = "Unauthorized";
    readonly #message = "The JWT's Composition is Malformed and Cannot be Verified";

    private constructor( server: [ HTTP["Request"], HTTP["Response"] ], exception: Options, realm: string | null = null ) {
        super( server, exception );

        this.realm = realm;

        this.code = (exception?.code) ? exception.code : this.#code;
        this.error = (exception?.error) ? exception.error : this.#error;
        this.status = (exception?.status) ? exception.status : this.#status;

        this.response.statusCode = (this.code) ? this.code : this.#code;
        this.response.statusMessage = (this.status) ? this.status : this.#status;

        this.message = (exception?.message) ? exception.message : this.#message;
    }

    /***
     * @param {HTTP["Headers"]} headers
     *
     * @returns {Promise<void>}
     */
    public async send( headers?: HTTP["Headers"] ) {
        await super.send( {
            ... headers, ... {
                "WWW-Authenticate": (this.realm)
                    ? [Malformation.authentication, "Realm", this.realm].join(" ")
                    : Malformation.authentication
            }
        } );
    }

    /***
     * Exception Initializer
     * ---
     *
     * @param {Options} exception
     * @param {Request} request
     * @param {Response} response
     *
     * @param {string | null} realm
     *
     * @returns {Malformation}
     *
     */
    public static initialize(request: HTTP["Request"], response: HTTP["Response"], exception?: Options, realm?: string | null ): Malformation {
        return new Malformation([request, response], exception, realm);
    }
}

export { Malformation };
export default {};