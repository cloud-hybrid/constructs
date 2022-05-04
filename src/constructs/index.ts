export * from "./stack.js";

import Parameter from "./ssm-parameter.js";

import { NGINX } from "./containerization/index.js";

export * from "./ecs/index.js";
export * from "./database/index.js";

const Resources = {
    Parameter, NGINX
};

export { Resources };
