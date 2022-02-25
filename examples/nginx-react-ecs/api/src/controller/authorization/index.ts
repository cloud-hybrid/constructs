/*** Authorization Controller (Router)
 *
 * @module Authorization
 *
 * Authorization via GET HTTP(s) Requests
 *      In order to successfully validate a request as valid, the client
 *      must include an "Authorization" header with the request using the following
 *      convention:
 *
 *      >>> Authorization: Bearer X.Y.Z
 *
 *      The controller will then interface validation logic that:
 *      1. Transforms the header into an object
 *      2. Look-up User-ID from object attributes
 *      3. Search database for User-ID
 *      4. Validate Session is valid
 *
 */

import { Router, Exception } from "..";

import { Token } from "./token";

const Controller = Router();

const Online = () => JSON.stringify({ Status: "Online" }, null, 4);
Controller.get("/", async (_, response) => {
    response.shouldKeepAlive = true;
    response.statusMessage = "Online";
    response.statusCode = 200;

    response.setHeader("Keep-Alive", 5);
    response.setHeader("Content-Type", "Application/JSON");

    response.write(Online());

    response.send();
});

Controller.use("/token", Token);

export { Router, Exception };
export { Controller as Authorization };
export default Controller;