#!/usr/bin/env node

import FS         from "fs";
import TTY        from "tty";
import Path       from "path";
import Process    from "process";
import Subprocess from "child_process";

import Chalk from "chalk";

// ECMAScript 2015
import "source-map-support/register.js";

import * as Utility from "./utility/index.js";

const CWD = Process.cwd();
const Parameters = Process.argv.splice( 2 ).map( ( $ ) => $.toLowerCase() );
const Interactive = Parameters.includes( "-i" ) || Parameters.includes( "-I" ) || Parameters.includes( "--interactive" ) || Parameters.includes( "interactive" );
const Debug = Parameters.includes( "--debug" ) || Parameters.includes( "debug" ) || Parameters.includes( "--verbose" ) || Parameters.includes( "verbose" );
const Creator = Parameters.includes( "--creator" ) || Parameters.includes( "creator" );

const Initialize = FS.existsSync( Path.join( Process.cwd(), "package.json" ) );

( Initialize ) || ( async () => {
    ( TTY.isatty( Process.stdin.fd ) ) && Subprocess
        .spawnSync( "npm", [ "init", "--force" ], {
            shell: false, stdio: "ignore"
        } );
} )();

const Package = FS.existsSync( Path.join( Process.cwd(), "package.json" ) );

Process.env.debug = String( Debug );
Process.env.package = String( Package );
Process.env.interactive = String( Interactive );

const setup = Chalk.whiteBright.bold( "Initializing" );
console.log( "[Log]" + " " + setup + " " + "IaC Package ... ", "\n" );

await Utility.Distribution.directory();

await ( new Utility.CDKTF() ).hydrate();
await ( new Utility.Package() ).hydrate();
await ( new Utility.Main() ).hydrate();
await ( new Utility.Ignore() ).hydrate();
await ( new Utility.Typescript() ).hydrate();

Process.chdir( Path.join( Process.cwd(), Process.env?.["config_iac"] ?? "ci" ) );

Process.stdout.write( "\n" );

const installation = Chalk.magentaBright.bold( "Installing" );
console.log( "[Log]" + " " + installation + " " + "Dependencies ... " );

( Package ) && await Utility.Spawn( "npm install --no-fund ." );

Process.stdout.write( "\n" );

const constructs = Chalk.greenBright.bold( "Downloading" );
console.log( "[Log]" + " " + constructs + " " + "Constructs + Provider(s) ... " );

const CDKTF = JSON.parse( String( FS.readFileSync( Path.join( Process.cwd(), "cdktf.json" ) ) ) );

( CDKTF?.terraformModules?.length > 0 || CDKTF?.terraformProviders?.length > 0 ) && await Utility.Spawn( "npm run get" ) || console.debug( Chalk.bold( "  ↳ " ) + Chalk.dim( "No TF Module(s) || Provider(s) Specified" ) );

Process.stdout.write( "\n" );

const compilation = Chalk.yellowBright.bold( "Compiling" );
console.log( "[Log]" + " " + compilation + " " + "TypeScript ➔ JavaScript ... " );

await Utility.Spawn( "npm run build" );

Process.stdout.write( "\n" );

switch ( Interactive ) {
    case true: {
        const initialize = Chalk.cyanBright.bold( "Running" );
        console.log( "[Log]" + " " + initialize + " " + Chalk.italic( "Interactive" ) + " " + "First-Time Setup" );

        await Utility.Spawn( "npm run initialize -- --reconfigure" );

        break;
    }
    case false: {
        const initialize = Chalk.redBright.underline.bold( "cd ./ci && npm run initialize" );
        console.log( Chalk.bold( "Lastly" ) + "," + " " + Chalk.italic( "Execute the Following to Finish Setup" ) );
        console.log( "  ↳ " + initialize );

        break;
    }
}

Process.stdout.write( "\n" );

Process.chdir( CWD );

(Creator) && import("open").then( ( $ ) => $.default( "https://github.com/segmentational", { wait: false } ) ).finally(() => {
    Process.stdout.write(Utility.ANSI("Bright-Green", "Web Browser has Successfully Opened" + "\n" + "\n"));
}).finally(() => {
    Process.stdout.clearLine(0);
});
