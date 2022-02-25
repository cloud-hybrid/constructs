import FS      from "fs";
import Path    from "path";
import Process from "process";
import HTTP    from "http";
import HTTPs   from "https";

import { Application, Controller, Middleware } from ".";

/// import { Initializer as Error } from "./src/utilities/error.js";

const CWD = Process.cwd();

/// (async () => await Middleware( Application ))();
await Middleware( Application );

const Configuration = { ... JSON.parse( String( FS.readFileSync( Path.join( CWD, ".env" ) ) ) ) };

/*** @type {{PFX: Buffer, Key: Buffer, Certificate: Buffer}} */
const Content = {
    Key: FS.readFileSync( Path.join( CWD, Configuration["TLS"]["Key"] ) ),
    PFX: FS.readFileSync( Path.join( CWD, Configuration["TLS"]["PFX"] ) ),
    Certificate: FS.readFileSync( Path.join( CWD, Configuration["TLS"]["Certificate"] ) )
};

/*** @type {{pfx: Buffer, passphrase: *, cert: Buffer, key: Buffer}} */
const options = {
    key: Content.Key,
    pfx: Content.PFX,
    cert: Content.Certificate,
    passphrase: Configuration["TLS"]["Passphrase"]
};

Application.use( "/", Controller );

// const $ = HTTPs.createServer( options, Application );
const $ = HTTP.createServer( Application );

Application.listen( 10500 ); // Websocket
$.listen( Process.env["Port"] ?? 3443 ); // API