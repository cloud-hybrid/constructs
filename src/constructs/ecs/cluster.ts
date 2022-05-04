import { CloudwatchLogGroup }            from "@cdktf/provider-aws/lib/cloudwatch/index.js";
import { EcsCluster, EcsTaskDefinition } from "@cdktf/provider-aws/lib/ecs/index.js";
import { IamRole }                       from "@cdktf/provider-aws/lib/iam/index.js";
import { Resource }                      from "@cdktf/provider-null/lib/resource.js";
import { Construct }                     from "constructs";

class Cluster extends Resource {
    public cluster: EcsCluster;

    constructor(scope: Construct, clusterName: string) {
        super(scope, clusterName);

        this.cluster = new EcsCluster( this, "ecs-cluster", {
            name: clusterName,
            capacityProviders: [ "FARGATE" ]
        } );
    }

    public runDockerImage(
        name: string,
        tag: string,
        image: Resource,
        env: Record<string, string | undefined>
    ) {
        // Role that allows us to get the Docker image
        const executionRole = new IamRole(this, "execution-role", {
            name: `${name}-execution-role`,
            inlinePolicy: [
                {
                    name: "allow-ecr-pull",
                    policy: JSON.stringify({
                        Version: "2012-10-17",
                        Statement: [
                            {
                                Effect: "Allow",
                                Action: [
                                    "ecr:GetAuthorizationToken",
                                    "ecr:BatchCheckLayerAvailability",
                                    "ecr:GetDownloadUrlForLayer",
                                    "ecr:BatchGetImage",
                                    "logs:CreateLogStream",
                                    "logs:PutLogEvents",
                                ],
                                Resource: "*",
                            },
                        ],
                    }),
                },
            ],
            // this role shall only be used by an ECS task
            assumeRolePolicy: JSON.stringify({
                Version: "2012-10-17",
                Statement: [
                    {
                        Action: "sts:AssumeRole",
                        Effect: "Allow",
                        Sid: "",
                        Principal: {
                            Service: "ecs-tasks.amazonaws.com",
                        },
                    },
                ],
            }),
        });

        // Role that allows us to push logs
        const taskRole = new IamRole(this, `task-role`, {
            name: [name, "task-role"].join("-"),
            inlinePolicy: [
                {
                    name: "allow-logs",
                    policy: JSON.stringify({
                        Version: "2012-10-17",
                        Statement: [
                            {
                                Effect: "Allow",
                                Action: ["logs:CreateLogStream", "logs:PutLogEvents"],
                                Resource: "*",
                            },
                        ],
                    }),
                },
            ],
            assumeRolePolicy: JSON.stringify({
                Version: "2012-10-17",
                Statement: [
                    {
                        Action: "sts:AssumeRole",
                        Effect: "Allow",
                        Sid: "",
                        Principal: {
                            Service: "ecs-tasks.amazonaws.com",
                        },
                    },
                ],
            }),
        });

        // Creates a log group for the task
        const logGroup = new CloudwatchLogGroup(this, `loggroup`, {
            name: `${this.cluster.name}/${name}`,
            retentionInDays: 30
        });

        // Creates a task that runs the docker container
        return new EcsTaskDefinition( this, `task`, {
            // We want to wait until the image is actually pushed
            dependsOn: [ image ],
            // These values are fixed for the example, we can make them part of our function invocation if we want to change them
            cpu: "256",
            memory: "512",
            requiresCompatibilities: [ "FARGATE", "EC2" ],
            networkMode: "awsvpc",
            executionRoleArn: executionRole.arn,
            taskRoleArn: taskRole.arn,
            containerDefinitions: JSON.stringify( [
                {
                    name,
                    image: tag,
                    cpu: 256,
                    memory: 512,
                    environment: Object.entries( env ).map( ( [ name, value ] ) => ( {
                        name,
                        value,
                    } ) ),
                    portMappings: [
                        {
                            containerPort: 80,
                            hostPort: 80,
                        },
                    ],
                    logConfiguration: {
                        logDriver: "awslogs",
                        options: {
                            // Defines the log
                            "awslogs-group": logGroup.name,
                            /// @todo
                            "awslogs-region": "us-east-2",
                            "awslogs-stream-prefix": name,
                        },
                    },
                },
            ] ),
            family: "service",
        } );
    }
}

export { Cluster };

export default Cluster;
