import Chalk   from "chalk";
import FS      from "fs";
import Path    from "path";
import Process from "process";
import Utility from "util";

import { Distribution } from "./distribution.js";

import { Template } from "./template.js";

enum Type {
    json = "json",
    ts = "ts",
    js = "js",
    tpl = "tpl"
}

type Options = keyof typeof Type;

/***
 * Extension of {@link Distribution}
 * ---
 *
 * Assumes no Template Injections
 *
 */

class Base extends Distribution {
    public readonly target: string;

    protected readonly file: string;
    protected readonly source: string;

    protected readonly template: Template;

    private readonly folder: string;

    /***
     * @param {string} url - Required, ESM's `import.meta.url`
     * @param {Options} type - Required, the template's file extension
     * @param {string} directory - Required, target output directory
     * @param {string} overload - Optional, force a target file name
     */
    public constructor( url: string, type: Options, directory: string, overload?: string ) {
        super( false );

        this.folder = directory;

        const $ = Base.module(url);

        this.file = ( overload ) ? overload : [$.name, type].join(".");
        this.source = Path.join($.directory, [$.name, "template", type].join("."));
        this.target = this.resolve( this.file );

        this.template = new Template(this.source);

        if ( !FS.existsSync( this.template.file ) ) {
            const $ = new Error( "Unable to Find Template File" );

            $.name = Chalk.red.bold( "Template-Not-Found-Exception" );

            Reflect.set( $, "pwd", Process.cwd() );
            Reflect.set( $, "source", this.source );
            Reflect.set( $, "target", this.target );
            Reflect.set( $, "template", this.template.file );
            Reflect.set( $, "resolver", this.resolve( this.file ) );

            /// Debugging Utility
            Reflect.set( $, "module", Base.module( url ) );

            Process.stderr.write( "\n" );
            const output = Utility.inspect( $, { depth: Infinity } );
            console.error( "[Error]", output );
            Process.exit( 1 );
        }
    }

    private readonly resolve = ( file: string = this.file ) => Path.join( Process.cwd(), this.folder, file );
}

export { Base, Options, Type };

export default Base;