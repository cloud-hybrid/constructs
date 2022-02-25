/***
 *
 * @module Context
 *
 * The Dependencies and Functions for View-Controller.
 *
 */

import Process from "process";

import Token from "jsonwebtoken";

const Verify = async (jwt: string, secret: string) => {
    return new Promise((resolve, reject) => {
        Token.verify(jwt, secret, (error, payload) => {
            if (error) {
                if ( error?.name === "TokenExpiredError" ) {
                    resolve(error);
                } else {
                    reject(error);
                }
            } else {
                resolve(payload);
            }
        });
    });
};

/***
 * @param token
 *
 * @returns {Promise<{Serialization, Type: null, Error, Verification, Token: {JWT}} | Error>}
 *
 * @constructor
 *
 */

const Validate = async (token) => {
    const JWT = token;

    /// Fatal Error - Catch @Controller Level
    if ( !JWT ) throw new Error("NIL");

    console.debug("[Authorization] (Debug)", "Context", "JWT-Token" + ":", JWT);
    try {
        return await Verify(JWT, Process.env["Secret"]);
    } catch ( error: any ) {
        const $ = JSON.stringify(error, null, 4);

        console.debug("[Authorization (Token - API)]", "[Error]", "Verification" + ":", $);

        /// --> Catch Expiration Error
        if ( error?.name === "TokenExpiredError" ) {
            throw new Error(JSON.stringify(error, null, 4));
            // return Schema(false, "JWT Token Expiration", null, "Expiration");
        } else if ( error.name === "JsonWebTokenError" ) {
            throw new Error(JSON.stringify(error, null, 4));
            // return Schema(false, "JWT Token Malformation", null, "Invalid");
        } else {
            throw new Error(JSON.stringify(error, null, 4));
        }
    }
};

export { Validate };
export default Validate;

export { Error } from "../../..";
