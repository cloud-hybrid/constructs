import { Exception } from "./exception";
export * from "./exception";

import { Malformation } from "./jwt";
export * from "./jwt";

const Error = {
    Exception, JWT: {
        Malformation
    }
};

export { Error };
export default { Error };