import Chalk   from "chalk";
import FS      from "fs";
import Utility from "util";
import Process from "process";

import { ANSI, Injectable } from "./index.js";

interface Expression {
    pattern: string;
    replacement: string;
}

type Expressions = Expression[];

/***
 * Template
 * ---
 *
 * - [ ] Template Injection without Input (Keys & Values) Expression(s)
 * - [ ] Template Injection with Single Input (Keys) Expression(s)
 * - [ ] Template Injection with Many Input (Keys) Expression(s)
 * - [ ] Template Injection with Single Input (Keys), Many References (Values) Expression(s)
 * - [ ] Template Injection with Many Input (Keys), Many References (Values) Expression(s)
 *
 * @todo Unit Tests (See Examples for Usages)
 *
 * @example
 * /// Template Injection without Input (Keys & Values) Expression(s)
 *
 * /// @example - template.tpl.json
 * /// { "key": "value" }
 *
 * const instance = new Template("./template.tpl.json");
 *
 * /// Functionally, Performs no Changes
 * const content = await this.injectable.inject();
 *
 * console.log(content);
 *
 * >>> { "key": "value" }
 *
 * @example
 * /// Template Injection with Single Input (Key & Value) Expression
 *
 * /// @example - template.tpl.json
 * /// { "{{ Template }}": "world" }
 *
 * const instance = new Template("./template.tpl.json");
 *
 * /// Replaces the `Template` Expression with `replacement`
 * const content = await this.injectable.inject([{
 *     pattern: "Template",
 *     replacement: "hello"
 * }]);
 *
 * console.log(content);
 *
 * >>> { "hello": "world" }
 *
 * @example
 * /// Template Injection with Single Input (Key), Mapped to Many Value Expression
 *
 * /// @example - template.tpl.json
 * /// [{ "{{ Template }}": "Sanders" }, { "{{ Template }}": "Greenwell" }]
 *
 * const instance = new Template("./template.tpl.json");
 *
 * /// Replaces the `Template` Expression with `replacement`
 * const content = await this.injectable.inject([{
 *     pattern: "Template",
 *     replacement: "Jacob"
 * }]);
 *
 * console.log(content);
 *
 * >>> [{ "Jacob": "Sanders" }, { "Jacob": "Greenwell" }]
 *
 * @example
 * /// Template Injection with Many Input (Key), Mapped to Single Value Expression
 *
 * /// @example - template.tpl.json
 * /// [{ "{{ Name-1 }}": "Sanders" }, { "{{ Name-2 }}": "Greenwell" }]
 *
 * const instance = new Template("./template.tpl.json");
 * const content = await this.injectable.inject([
 *      {
 *          pattern: "Name-1",
 *          replacement: "Jacob"
 *      }, {
 *          pattern: "Name-2",
 *          replacement: "John"
 *      }
 * ]);
 *
 * console.log(content);
 *
 * >>> [{ "Jacob": "Sanders" }, { "John": "Greenwell" }]
 *
 * @example
 * /// Template Injection with Many Input (Key), Mapped to Many Value Expression
 *
 * /// @example - template.tpl.json
 * /// [{ "{{ Name-1 }}": "Sanders" }, { "{{ Name-1 }}": "Greenwell" }, { "{{ Name-2 }}": "Doe" }]
 *
 * const instance = new Template("./template.tpl.json");
 * const content = await this.injectable.inject([
 *      {
 *          pattern: "Name-1",
 *          replacement: "Jacob"
 *      }, {
 *          pattern: "Name-2",
 *          replacement: "Jane"
 *      }
 * ]);
 *
 * console.log(content);
 *
 * >>> [{ "Jacob": "Sanders" }, { "Jacob": "Greenwell" }, { "Jane", "Doe" }]
 *
 */

class Template {
    public file: string;

    public readonly debug: boolean;

    public pattern?: string;
    public replacement?: string;

    private output?: string;

    private buffer?: Buffer | string | null;
    private colorize?: Buffer | string | null;
    private template?: Buffer | string | null;

    private static readonly keys = ( match: string ) => {
        return RegExp( "{{(.(" + match + ").)}}", "gm" );
    };

    /***
     * @private
     * @async
     *
     * @param {string} file
     * @returns {Promise<string>}
     */
    private static readonly read = async ( file: string ) => {
        const $ = Utility.promisify( FS.readFile );
        const buffer = await $( file );
        return String( buffer );
    };

    /***
     * @public
     *
     * @see {@link Template}
     *
     * @param {string} file
     * @param {boolean} debug
     */
    public constructor( file: string, debug?: boolean ) {
        this.file = file;
        this.debug = debug ?? ( Process.env?.["debug"] === "true" ) ?? false;
    }

    /***
     * @public
     * @async
     *
     * @see {@link Template}
     * @param file
     * @param {Expressions} expressions
     * @returns {Promise<string>}
     */
    public async inject( source: string, target: string, expressions?: Expressions ): Promise<void> {
        this.buffer = await Template.read( source );

        if ( expressions ) {
            let counter = 0;
            const total = expressions.length;
            for await ( const expression of expressions ) {
                counter += 1;

                // Pattern := Key
                this.pattern = expression.pattern;
                // Replacement := Value
                this.replacement = expression.replacement;

                const contents = String( this.buffer );
                const match = Template.keys( this.pattern ).exec( contents );

                if ( match && this.pattern && this.replacement ) {
                    const leading = Chalk.bold( ANSI( "Bright-Yellow", match[0].substring( 0, 2 ) ) );
                    const trailing = Chalk.bold( ANSI( "Bright-Yellow", match[0].substring( match[0].length - 2, match[0].length ) ) );
                    const variable = Chalk.bold( ANSI( "Bright-Red", match[0].substring( 2, match[0].length - ( 2 ) ).trim() ) );

                    const preface = Chalk.gray( String( this.buffer ).replaceAll(
                        match[0], leading + " " + variable + " " + trailing
                    ) );

                    /// Only for Debugging Purposes - complexity can be functionally disregarded
                    ( this.debug ) && Process.stdout.write( Chalk.bold( "  — " ) + "Template Content" + " " + "(" + ( counter ) + "/" + total + ")" + ":" + preface.split( "\n" ).map( ( $,
                        index ) => ( index ) !== 0 && "  " + $ || " " + $ ).join( "\n" ) + "\n" );

                    this.colorize = contents.replaceAll( match[0], Chalk.bold.underline( ANSI( "Green", this.replacement ) ) );
                    this.template = contents.replaceAll( match[0], this.replacement );

                    /// Only for Debugging Purposes - complexity can be functionally disregarded
                    ( this.debug ) && Process.stdout.write( Chalk.bold( "  — " ) + "Hydration" + " " + "(" + ( counter ) + "/" + total + ")" + ":" + " " + Chalk.gray( this.colorize.split( "\n" ).map( ( $,
                        index ) => ( index ) !== 0 && "  " + $ || " " + $ ).join( "\n" ) ) + "\n" );

                    this.output = this.template;

                    this.update( Buffer.from( this.template ) );

                    await Injectable.write( target, String( this.buffer ) );
                }
            }
        }
    }

    /***
     * Synchronous Version of {@link Template.inject}
     *
     * @public
     * @param {Expressions} expressions
     * @returns {string}
     */
    public populate( expressions?: Expressions ): string {
        this.buffer = FS.readFileSync( this.file );
        ( expressions ) && expressions.forEach( ( $, index, array ) => {
            // Pattern := Key
            this.pattern = $.pattern;
            // Replacement := Value
            this.replacement = $.replacement;
            const contents = String( this.buffer );
            const match = Template.keys( this.pattern ).exec( contents );
            if ( match && this.pattern && this.replacement ) {
                const leading = Chalk.bold( ANSI( "Bright-Yellow", match[0].substring( 0, 2 ) ) );
                const trailing = Chalk.bold( ANSI( "Bright-Yellow", match[0].substring( match[0].length - 2, match[0].length ) ) );
                const variable = Chalk.bold( ANSI( "Bright-Red", match[0].substring( 2, match[0].length - ( 2 ) ).trim() ) );
                const preface = Chalk.gray( String( this.buffer ).replaceAll(
                    match[0], leading + " " + variable + " " + trailing
                ) );
                /// Only for Debugging Purposes - complexity can be functionally disregarded
                ( this.debug ) && Process.stdout.write( Chalk.bold( "  — " ) + "Template Content" + " " + "(" + ( index + 1 ) + "/" + array.length + ")" + ":" + preface.split( "\n" ).map( ( $,
                    index ) => ( index ) !== 0 && "  " + $ || " " + $ ).join( "\n" ) + "\n" );
                this.colorize = contents.replaceAll( match[0], Chalk.bold.underline( ANSI( "Green", this.replacement ) ) );
                this.template = contents.replaceAll( match[0], this.replacement );
                /// Only for Debugging Purposes - complexity can be functionally disregarded
                ( this.debug ) && Process.stdout.write( Chalk.bold( "  — " ) + "Hydration" + " " + "(" + ( index + 1 ) + "/" + array.length + ")" + ":" + " " + Chalk.gray( this.colorize.split( "\n" ).map( ( $,
                    index ) => ( index ) !== 0 && "  " + $ || " " + $ ).join( "\n" ) ) + "\n" );
                this.output = this.template;
                this.update( Buffer.from( this.template ) );
            }
        } );
        return String( this.buffer );
    }

    private update( content: Buffer | string ) {
        this.buffer = content;
    }
}

export { Template };

export default Template;