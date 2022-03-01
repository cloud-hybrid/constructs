import { SecurityGroup } from "@cdktf/provider-aws/lib/vpc";
import { Resource }      from "@cdktf/provider-null/lib/resource";
import { Fn }            from "cdktf";
import { Construct }     from "constructs";

import { Random, Rds, Vpc } from "..";

class PostgreSQL extends Resource {
    public static readonly port = 5432;

    public instance: Rds;

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
            vpcId: Fn.tostring( vpc.vpcIdOutput ),
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
        this.instance = new Rds( this, "db", {
            identifier: `${ name }-db`,

            engine: "postgres",
            engineVersion: "14.1",
            family: "postgres14",
            instanceClass: "db.t3.micro",
            allocatedStorage: "5",

            createDbOptionGroup: true,
            createDbParameterGroup: true,
            applyImmediately: true,
            port: String( PostgreSQL.port ),
            username: "administrator",
            password: password.result,

            maintenanceWindow: "Mon:00:00-Mon:03:00",
            backupWindow: "03:00-06:00",

            subnetIds: vpc.databaseSubnetsOutput as unknown as any,
            vpcSecurityGroupIds: [ dbSecurityGroup.id ]
        } );
    }
}

export { PostgreSQL };

export default PostgreSQL;