import HTTPs from "https";

const $ = function ( error: string | null, address: string | null | undefined, resolve: { ( value: unknown ): void; ( value: unknown ): void; ( arg0: string | undefined ): any; } ) {
    if ( error ) return console.log( error );
    if ( address != null ) { process.env["ip"] = address; }

    console.debug( "[Debug] [IPv4] [Global]", "Public IPv4 Address" + ":", process.env?.["ip"] );

    return resolve( process.env["ip"] );
};

const IP = () => new Promise( ( resolve ) => {
    HTTPs.get( {
        host: "api.ipify.org"
    }, function ( response ) {
        let ip = "";

        response.on( "data", function ( chunk ) {
            ip += chunk;
        } );
        response.on( "end", function () {
            if ( ip ) {
                $( null, ip, resolve );
            } else {
                $( "Error: Unable to get IP Address", null, resolve );
            }
        } );
    } );
} );

export { IP };

export default IP;