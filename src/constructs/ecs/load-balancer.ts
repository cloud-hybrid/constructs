import { EcsCluster, EcsService, EcsTaskDefinition }     from "@cdktf/provider-aws/lib/ecs";
import { Lb, LbListener, LbListenerRule, LbTargetGroup } from "@cdktf/provider-aws/lib/elb";
import { SecurityGroup }                                 from "@cdktf/provider-aws/lib/vpc";
import { Fn, Resource }   from "cdktf";
import { Construct }      from "constructs";
import { Vpc }            from "..";

class LB extends Resource {
    lb: Lb;
    lbl: LbListener;
    vpc: Vpc;
    cluster: EcsCluster;

    constructor(scope: Construct, name: string, vpc: Vpc, cluster: EcsCluster) {
        super(scope, name);
        this.vpc = vpc;
        this.cluster = cluster;

        const lbSecurityGroup = new SecurityGroup(this, `lb-security-group`, {
            vpcId: Fn.tostring(vpc.vpcIdOutput),
            ingress: [
                // allow HTTP traffic from everywhere
                {
                    protocol: "TCP",
                    fromPort: 80,
                    toPort: 80,
                    cidrBlocks: ["0.0.0.0/0"],
                    ipv6CidrBlocks: ["::/0"],
                },
            ],
            egress: [
                // allow all traffic to every destination
                {
                    fromPort: 0,
                    toPort: 0,
                    protocol: "-1",
                    cidrBlocks: ["0.0.0.0/0"],
                    ipv6CidrBlocks: ["::/0"],
                },
            ],
        });
        this.lb = new Lb(this, `lb`, {
            name,
            // we want this to be our public load balancer so that cloudfront can access it
            internal: false,
            loadBalancerType: "application",
            securityGroups: [lbSecurityGroup.id],
        });

        // This is necessary due to a shortcoming in our token system to be adressed in
        // https://github.com/hashicorp/terraform-cdk/issues/651
        this.lb.addOverride("subnets", vpc.publicSubnetsOutput);

        this.lbl = new LbListener(this, `lb-listener`, {
            loadBalancerArn: this.lb.arn,
            port: 80,
            protocol: "HTTP",
            defaultAction: [
                // We define a fixed 404 message, just in case
                {
                    type: "fixed-response",
                    fixedResponse: {
                        contentType: "text/plain",
                        statusCode: "404",
                        messageBody: "Could not find the resource you are looking for",
                    },
                },
            ],
        });
    }

    exposeService(
        name: string,
        task: EcsTaskDefinition,
        serviceSecurityGroup: SecurityGroup,
        path: string
    ) {
        // Define Load Balancer target group with a health check on /ready
        const targetGroup = new LbTargetGroup(this, `target-group`, {
            dependsOn: [this.lbl],
            name: `${name}-target-group`,
            port: 80,
            protocol: "HTTP",
            targetType: "ip",
            vpcId: Fn.tostring(this.vpc.vpcIdOutput),
            healthCheck: {
                enabled: true,
                path: "/ready",
            },
        });

        // Makes the listener forward requests from subpath to the target group
        new LbListenerRule(this, `rule`, {
            listenerArn: this.lbl.arn,
            priority: 100,
            action: [
                {
                    type: "forward",
                    targetGroupArn: targetGroup.arn,
                },
            ],

            condition: [
                {
                    pathPattern: { values: [`${path}*`] },
                },
            ],
        });

        // Ensure the task is running and wired to the target group, within the right security group
        new EcsService(this, `service`, {
            dependsOn: [this.lbl],
            name,
            launchType: "FARGATE",
            cluster: this.cluster.id,
            desiredCount: 1,
            taskDefinition: task.arn,
            networkConfiguration: {
                subnets: Fn.tolist(this.vpc.publicSubnetsOutput),
                assignPublicIp: true,
                securityGroups: [serviceSecurityGroup.id],
            },
            loadBalancer: [
                {
                    containerPort: 80,
                    containerName: name,
                    targetGroupArn: targetGroup.arn,
                },
            ],
        });
    }
}

export { LB };

export default LB;