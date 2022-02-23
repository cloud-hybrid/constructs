import $ from "inquirer";

const normalize = (input: string) => {
    input = (input !== "") ? input : "[N/A]";

    return input.split( " " ).map( ($) => {
        return $.toString()[0].toUpperCase() + $.toString().slice( 1 );
    } ).join( "-" ).split( "_" ).map( ($) => {
        return $.toString()[0].toUpperCase() + $.toString().slice( 1 );
    } ).join( "-" ).split( "-" ).map( ($) => {
        return $.toString()[0].toUpperCase() + $.toString().slice( 1 );
    } ).join( "-" ).replace(".", "");
}

const characters = (value: any) => {
    if ( !valid( value ) ) {
        return "[Warning] Input Value Required (String)";
    } else {
        if ( new RegExp("^(\\w+)$", "g").exec( value ) !== null ) {
            return true;
        }
    }

    return "[Error] Incorrect Input Type - Expected (String)";
};

/***
 * - `^`               // start of line
 * - `[a-zA-Z]{2,}`    // will except a name with at least two characters
 * - `\s`              // will look for white space between name and surname
 * - `[a-zA-Z]{1,}`    // needs at least 1 Character
 * - `\'?-?`           // possibility of **'** or **-** for double barreled and hyphenated surnames
 * - `[a-zA-Z]{2,}`    // will except a name with at least two characters
 * - `\s?`             // possibility of another whitespace
 * - `([a-zA-Z]{1,})?` // possibility of a second surname
 *
 * @param value
 *
 * @returns {string | boolean}
 *
 */
const name = (value: any) => {
    if ( !valid( value ) ) {
        return "[Warning] Input Value Required (Human Identifiable Name)";
    } else {
        if ( new RegExp("^([a-zA-Z]{2,}\\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\\s?([a-zA-Z]{1,})?)", "g").exec( value ) !== null ) {
            return true;
        }
    }

    return "[Error] Incorrect Input Type - Expected (String, Human Identifiable Name)";
};

const digit = (value: any) => {
    if ( !valid( value ) ) {
        return "[Warning] Input Value Required (Digit)";
    }

    return ( new RegExp("^(\\d+)$", "g").exec( value ) !== null) ? true : "[Error] Incorrect Input Type - Expected (Number)";
};

const empty = (value: any) => {
    // Expression that matches upon empty input
    // Note: the following expression will match empty input in global, multiline mode
    const expression = new RegExp( "((\\r\\n|\\n|\\r)$)|(^(\\r\\n|\\n|\\r))|^\\s*$", "g" );

    return (expression.test( value ));
};

const valid = (value: any) => {
    return (!empty( value ));
};

const message = (value: string) => {
    return value;
}

const Validation = {
    characters, digit, empty, valid, message, name
};

type Asynchronous = (input: string | number | any) => Promise<boolean>;

/***
 * Note that the following class is meant to act only as
 * a meta definition for inheritance; it cannot be used
 * as context for a prompt.
 */

class Abstract {
    name: string;
    message: string;

    validate?: Asynchronous;

    private readonly default: Function;
    private readonly defaults?: string | null;

    constructor(name: string, message: string, defaults?: any, validation?: Function | Asynchronous) {
        this.name = name;
        this.message = message;
        this.defaults = defaults;

        (validation) && Reflect.set( this,
            "validate",
            validation
        );

        this.default = () => {
            return this.defaults;
        };
    }
}

/***
 * For validations, either create an asynchronous class
 * or elect to import the Validation object.
 *
 * @example
 * import Question, { Field, Validation } from "./question";
 *
 * const validation = async ($: any) => {
 *     const result = await new Promise( (resolve) => {
 *         setTimeout( () => resolve($), 10000 );
 *     } );
 *
 *     return Validation.digit( result );
 * };
 *
 * const Name = Field.initialize( "name", "Name", "Jacob" );
 * const Surname = Field.initialize( "surname", "Last-Name", "Sanders" );
 * const Age = Field.initialize( "age", "Age", null, validation);
 *
 * const questions = [
 *     Name,
 *     Surname,
 *     Age
 * ];
 *
 * Question.prompt( questions ).then( (answers) => {
 *     console.log( JSON.stringify( answers, null, 4 ) );
 * } );
 *
 */

class Field extends Abstract {
    private readonly type: string = "input";

    private constructor(name: string, message: string, defaults?: string | null, validation?: Function | Asynchronous) {
        super( name, message, defaults, validation );
    }

    static initialize(name: string, message: string, defaults?: string | null, validation?: Function | Asynchronous) {
        return new Field(
            name,
            message,
            defaults,
            validation
        );
    }
}

/***
 * For validations, either create an asynchronous class
 * or elect to import the Validation object.
 *
 * @example
 * import Question, { Title, Validation } from "./question";
 *
 * const validation = async ($: any) => {
 *     const result = await new Promise( (resolve) => {
 *         setTimeout( () => resolve($), 10000 );
 *     } );
 *
 *     return Validation.digit( result );
 * };
 *
 * const Name = Title.initialize( "name", "Name", "Jacob" );
 * const Surname = Title.initialize( "surname", "Last-Name", "Sanders" );
 * const Age = Title.initialize( "age", "Age", null, validation);
 *
 * const questions = [
 *     Name,
 *     Surname,
 *     Age
 * ];
 *
 * Question.prompt( questions ).then( (answers) => {
 *     console.log( JSON.stringify( answers, null, 4 ) );
 * } );
 *
 */

class Title extends Abstract {
    private readonly type: string = "input";

    private constructor(name: string, message: string, defaults?: string | null, validation?: Function | Asynchronous) {
        super( name, message, defaults, validation );
    }

    static initialize(name: string, message: string, defaults?: string | null, validation?: Function | Asynchronous) {
        return new Title(
            name,
            message,
            defaults,
            validation
        );
    }
}

/***
 * For validations, either create an asynchronous class
 * or elect to import the Validation object.
 *
 * @example
 * import Question, { Input, Selectable, Validation } from "./question";
 *
 * const validation = async ($: any) => {
 *     const result = await new Promise( (resolve) => {
 *         setTimeout( () => resolve($), 10000 );
 *     } );
 *
 *     return Validation.digit( result );
 * };
 *
 * const Name = Input.initialize( "name", "Name", "Jacob" );
 * const Surname = Input.initialize( "surname", "Last-Name", "Sanders" );
 * const Age = Input.initialize( "age", "Age", null, validation);
 *
 * const List = Selectable.initialize("list", "Selection", ["Test-1", "Test-2"]);
 *
 * const questions = [
 *     Name,
 *     Surname,
 *     Age,
 *
 *     List
 * ];
 *
 * Question.prompt( questions ).then( (answers) => {
 *     console.log( JSON.stringify( answers, null, 4 ) );
 * } );
 *
 */

class Selectable extends Abstract {
    private choices: string[];
    private readonly type: string = "list";

    private constructor(name: string, message: string, array: string[], defaults?: string | null, validation?: Function | Asynchronous) {
        super( name, message, defaults, validation );

        this.choices = array;
    }

    static initialize(name: string, message: string, array: string[], defaults?: string | null, validation?: Function | Asynchronous) {
        return new Selectable(
            name,
            message,
            array,
            defaults,
            validation
        );
    }
}

class Password extends Abstract {
    private readonly type: string = "password";

    private constructor(name: string, message: string, defaults?: string | null, validation?: Function | Asynchronous) {
        super( name, message, defaults, validation );
    }

    static initialize(name: string, message: string, defaults?: string | null, validation?: Function | Asynchronous) {
        return new Password(
            name,
            message,
            defaults,
            validation
        );
    }
}

const Question = $;

export {
    Field,
    Title,
    Password,
    Selectable,
    Validation,
    Question,
    normalize
};

export default Question;