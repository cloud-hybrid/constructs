export * from "./stack";

import * as Random from "../../distribution/providers/random";

import Parameter from "./ssm-parameter";
import { NGINX } from "./containerization";

export * from "../../distribution/modules/terraform-aws-modules/aws/rds";
export * from "../../distribution/modules/terraform-aws-modules/aws/vpc";

export * from "./ecs";
export * from "./database";

const Resources = {
    Parameter, NGINX
};

export { Resources, Random };
