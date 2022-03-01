/***
 * Example Backend Unit-Testing Module
 */

import { get } from ".";
import { post } from ".";

/*** Starting Point */
for ( let i = 0; i < 10; i++ ) {
    /// 100 iterations are run due to previous issues associated with generating a raw, JSON serializable
    /// string from HTTP response chunks, which should come in as a Base64-encoded Buffer.
    /// Overall, the test(s) should take ~ 20 seconds if i ~= 100.

    describe( [ "HTTP GET Unit Test", "", [ "(", i, ")" ].join( "" ) ].join( " " ), () => {
        it( [ "Asynchronous Invocation", [ "(", i, ")" ].join( "" ) ].join( " " ), async () => {
            const gettable = await get( [ "https://jsonplaceholder.typicode.com/posts/", i ].join( "" ), {} );

            console.log( "[Log] GET Request", gettable );

            expect( gettable ).toBeTruthy();
        } );
    } );

    describe( [ "HTTP POST Unit Test", "", [ "(", i, ")" ].join( "" ) ].join( " " ), () => {
        it( [ "Asynchronous Invocation", [ "(", i, ")" ].join( "" ) ].join( " " ), async () => {
            const $ = await post( "https://jsonplaceholder.typicode.com/posts", JSON.stringify( {
                title: "title",
                "body": "body",
                userId: i
            } ), {} );

            console.log( "[Log] POST Request", $ );

            expect( $ ).toBeTruthy();
        } );
    } );
}

export {};

export default {};