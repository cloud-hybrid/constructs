export * from "./stack";

import Parameter from "./ssm-parameter";
import { NGINX } from "./containerization";

const Resources = {
    Parameter, NGINX
};

export { Resources };
