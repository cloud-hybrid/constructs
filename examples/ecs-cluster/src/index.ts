import { CloudfrontDistribution }                                                                                                 from "@cdktf/provider-aws/lib/cloudfront";
import { Fn, TerraformOutput }                                                                                                    from "cdktf";
import { SecurityGroup }                                                                                                          from "@cdktf/provider-aws/lib/vpc";
import { Stack, Settings, Construct, State, Synthesize, Resources, AWS, Store, Null, Random, Cluster, LB, PostgreSQL, Image, S3 } from "@cloud-technology/constructs";
import * as Path                                                                                                                  from "path";

import { Vpc } from "./../../../distribution/modules/terraform-aws-modules/aws/vpc";

const S3_ORIGIN_ID = "s3Origin";
const BACKEND_ORIGIN_ID = "backendOrigin";

class Infrastructure extends Stack {
    constructor( scope: Construct, name: string, settings: Settings ) {
        super(scope, name, settings);

        new Null.NullProvider(this, "null", {});
        new Random.RandomProvider(this, "random", {});

        const vpc = new Vpc(this, "vpc", {
            cidr: "10.0.0.0/16",
            /// @todo
            azs: ["a", "b", "c"].map((i) => `us-east-2${i}`),
            privateSubnets: ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"],
            publicSubnets: ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"],
            databaseSubnets: ["10.0.201.0/24", "10.0.202.0/24", "10.0.203.0/24"],
            createDatabaseSubnetGroup: true,
            enableNatGateway: true,
            // Using a single NAT Gateway will save us some money, coming with the cost of less redundancy
            singleNatGateway: true,
        });

        const cluster = new Cluster(this, "cluster");
        const loadBalancer = new LB(
            this,
            "loadbalancer",
            vpc,
            cluster.cluster
        );
        const serviceSecurityGroup = new SecurityGroup(
            this,
            `service-security-group`,
            {
                vpcId: Fn.tostring(vpc.vpcIdOutput),
                ingress: [
                    // only allow incoming traffic from our load balancer
                    {
                        protocol: "TCP",
                        fromPort: 80,
                        toPort: 80,
                        securityGroups: loadBalancer.lb.securityGroups,
                    },
                ],
                egress: [
                    // allow all outgoing traffic
                    {
                        fromPort: 0,
                        toPort: 0,
                        protocol: "-1",
                        cidrBlocks: ["0.0.0.0/0"],
                        ipv6CidrBlocks: ["::/0"],
                    },
                ],
            }
        );

        const db = new PostgreSQL(
            this,
            "dockerintegration",
            vpc,
            serviceSecurityGroup
        );

        const { image: backendImage, tag: backendTag } = new Image(
            this,
            "backend-image",
            Path.resolve(__dirname, "../application/backend")
        );

        const task = cluster.runDockerImage("backend", backendTag, backendImage, {
            PORT: "80",
            POSTGRES_USER: db.instance.username,
            POSTGRES_PASSWORD: db.instance.password,
            POSTGRES_DB: db.instance.identifier,
            POSTGRES_HOST: Fn.tostring(db.instance.dbInstanceAddressOutput),
            POSTGRES_PORT: Fn.tostring(db.instance.dbInstancePortOutput),
        });
        loadBalancer.exposeService(
            "backend",
            task,
            serviceSecurityGroup,
            "/backend"
        );

        const bucket = new S3(
            this,
            name,
            Path.resolve(__dirname, "../application/frontend/build")
        );

        const cdn = new CloudfrontDistribution(this, "cf", {
            comment: `Docker example frontend`,
            enabled: true,
            defaultCacheBehavior: {
                // Allow every method as we want to also serve the backend through this
                allowedMethods: [
                    "DELETE",
                    "GET",
                    "HEAD",
                    "OPTIONS",
                    "PATCH",
                    "POST",
                    "PUT",
                ],
                cachedMethods: ["GET", "HEAD"],
                targetOriginId: S3_ORIGIN_ID,
                viewerProtocolPolicy: "redirect-to-https", // ensure we serve https
                forwardedValues: { queryString: true, cookies: { forward: "none" } },
            },

            // origins describe different entities that can serve traffic
            origin: [
                {
                    originId: S3_ORIGIN_ID, // origin ids can be freely chosen
                    domainName: bucket.websiteEndpoint, // we serve the website hosted by S3 here
                    customOriginConfig: {
                        originProtocolPolicy: "http-only", // the CDN terminates the SSL connection, we can use http internally
                        httpPort: 80,
                        httpsPort: 443,
                        originSslProtocols: ["TLSv1.2", "TLSv1.1", "TLSv1"],
                    },
                },
                {
                    originId: BACKEND_ORIGIN_ID,
                    domainName: loadBalancer.lb.dnsName, // our backend is served by the load balancer
                    customOriginConfig: {
                        originProtocolPolicy: "http-only",
                        httpPort: 80,
                        httpsPort: 443,
                        originSslProtocols: ["TLSv1.2", "TLSv1.1", "TLSv1"],
                    },
                },
            ],
            // We define everything that should not be served by the default here
            orderedCacheBehavior: [
                {
                    allowedMethods: [
                        "HEAD",
                        "DELETE",
                        "POST",
                        "GET",
                        "OPTIONS",
                        "PUT",
                        "PATCH",
                    ],
                    cachedMethods: ["HEAD", "GET"],
                    pathPattern: "/backend/*", // our backend should be served under /backend
                    targetOriginId: BACKEND_ORIGIN_ID,
                    // low TTLs so that the cache is busted relatively quickly
                    minTtl: 0,
                    defaultTtl: 10,
                    maxTtl: 50,
                    viewerProtocolPolicy: "redirect-to-https",
                    // currently our backend needs none of this, but it could potentially use any of these now
                    forwardedValues: {
                        queryString: true,
                        headers: ["*"],
                        cookies: {
                            forward: "all",
                        },
                    },
                },
            ],
            defaultRootObject: "index.html",
            restrictions: { geoRestriction: { restrictionType: "none" } },
            viewerCertificate: { cloudfrontDefaultCertificate: true }, // we use the default SSL Certificate
        });

        // Prints the domain name that serves our application
        new TerraformOutput(this, "domainName", {
            value: cdn.domainName,
        });
    }
}

await Synthesize( Infrastructure );
