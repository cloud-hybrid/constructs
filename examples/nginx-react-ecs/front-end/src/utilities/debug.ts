const $ = process.env[ "NODE_ENV" ] || "development";

const Development = ( $ === "development" );
const Production = ( $ === "production" );
const Debug = ( $ === "development" );

export default Debug;

export {
    Debug,
    Production,
    Development
};
