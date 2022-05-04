import { Vpc, SecurityGroup } from "@cdktf/provider-aws/lib/vpc/index.js";
import { RdsClusterInstance } from "@cdktf/provider-aws/lib/rds/index.js";
import { Resource }      from "@cdktf/provider-null/lib/resource.js";
import { Fn }            from "cdktf";
import { Construct }     from "constructs";

import * as Random from "@cdktf/provider-random";

class PostgreSQL extends Resource {
    public static readonly port = 5432;

    public instance: RdsClusterInstance;

    constructor(
        scope: Construct,
        name: string,
        vpc: Vpc,
        serviceSecurityGroup: SecurityGroup
    ) {
        super( scope, name );

        // Create a password stored in the TF State on the fly
        const password = new Random.Password( this, "db-password", {
            length: 16,
            special: false
        } );

        const dbSecurityGroup = new SecurityGroup( this, "db-security-group", {
            vpcId: Fn.tostring( vpc.id ),
            ingress: [
                // allow traffic to the DBs port from the service
                {
                    fromPort: PostgreSQL.port,
                    toPort: PostgreSQL.port,
                    protocol: "TCP",
                    securityGroups: [ serviceSecurityGroup.id ]
                }
            ]
        } );

        // Using this module: https://registry.terraform.io/modules/terraform-aws-modules/rds/aws/latest
        this.instance = new RdsClusterInstance( this, "db", {
            clusterIdentifier: `${ name }-db`,
            engine: "postgres",
            engineVersion: "14.1",
            instanceClass: "db.t3.micro",
            applyImmediately: true
        } );
    }
}

export { PostgreSQL };

export default PostgreSQL;