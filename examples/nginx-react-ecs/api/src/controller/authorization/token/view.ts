import { Validate, Error, Router } from ".";

const Controller = Router();
Controller.post( "/", async ( request, response ) => {
    console.debug( "[Authorization] (Debug)", "Token", "Request" + " " + ":", {
        Origin: request.originalUrl,
        Query: request.query,
        Body: request.body,
        Headers: request.headers
    } );

    const Header = request.header( "Authorization" );

    const Token = ( Header ) ? Header.split( " " ).pop() : request.body["Token"] || request.body["token"] || request.header( "X-Nexus-JWT-Access-Token" ) || request.query?.["Token"] || request.query?.["token"] ||
        request.body["JWT"] || request.body["jwt"] || request.header( "X-JWT-Token" ) || request.header( "X-JWT" ) || request.query?.["JWT"] || request.query?.["jwt"] ||
        null;

    if ( Token === null ) {
        // const error = {
        //     message: "JWT Required as Input",
        //     error: "Authorization-Not-Found-Exception",
        //     status: 422
        // };

        // const error = {
        //     message: "JWT Required as Input",
        //     error: "Authorization-Not-Found-Exception"
        // };

        // const error = {
        //     message: "JWT Required as Input"
        // };

        const error = {};

        const exception = Error.Exception.initialize( request, response, error );

        await exception.send();
    } else {
        const $ = await Validate( Token );

        const exception = Error.JWT.Malformation.initialize( request, response );

        await exception.send();

        /// response.setHeader("WWW-Authenticate", "Realm Nexus-JWT-Validator");

//        response.type("Application/JSON");
//        response.send(JSON.stringify({
//            Message: $
//        }, null, 4));
    }
} );

export { Controller as Token };

export default Controller;
