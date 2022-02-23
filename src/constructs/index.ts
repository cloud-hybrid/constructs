export * as AWS from "./compilation/providers/aws";

export * from "./stack";

export * from "../utility";
export * from "../resource";
export * from "../configuration";

import Parameter from "./ssm-parameter";

const Resources = {
    Parameter
};

export { Resources };
