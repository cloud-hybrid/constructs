import Process from "process";

import Token from "jsonwebtoken";

const Authenticate = (request, response, callback) => {
    const Header = request.headers.authorization ?? request.header("Authorization") ?? null;

    if ( Header ) {
        const JWT = (Header) ? Header.split(" ").pop() : request.body["Token"] || request.body["token"] || request.header("X-Nexus-JWT-Access-Token") || request.query?.Token || request.query?.token ||
            request.body["JWT"] || request.body["jwt"] || request.header("X-JWT-Token") || request.header("X-JWT") || request.query?.JWT || request.query?.jwt ||
            null;

        Token.verify(JWT, Process.env["Secret"], (error, user) => {
            if ( error ) {
                console.error("[Authorization (Middleware)]", "[Error]", JSON.stringify(error, null, 4));

                response.statusCode = 403;
                response.statusMessage = "Access-Denied";

                response.type("Application/JSON");
                return response.send(JSON.stringify({
                    Message: "Validation Failure",
                    Error: "Access-Denied",
                    Realm: "Nexus",
                    Status: 403
                }, null, 4));
            }

            response.statusMessage = "Verified";

            console.log("[Authorization (Middleware)]", JSON.stringify(user, null, 4));

            callback();
        });
    } else {
        console.error("[Authorization (Middleware)]", "[Error]", "Unauthorized Access Attempt");

        response.statusCode = 401;
        response.statusMessage = "Unauthorized";

        response.setHeader("WWW-Authenticate", "Realm Nexus-JWT-Validator");

        response.type("Application/JSON");
        response.send(JSON.stringify({
            Error: "JWT",
            Realm: "Nexus",
            Status: 401
        }, null, 4));
    }
};

export { Authenticate };

export default Authenticate;