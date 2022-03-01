provider "aws" {
    region                   = var.region
    shared_config_files      = [ "~/.aws/config" ]
    shared_credentials_files = [ "~/.aws/credentials" ]
    profile                  = "default"

    skip_metadata_api_check = false

    default_tags {
        tags = {
            Organization : title(var.organization)
            Environment : title(var.environment)
            Service : title(var.service)
            Creator : title(var.creator)
            Cloud : var.cloud
            CFN : "False"
            TF : "True"
        }
    }

}

locals {
    acls = {
        default-inbound = [
            {
                rule_number = 900
                rule_action = "allow"
                from_port   = 1024
                to_port     = 65535
                protocol    = "tcp"
                cidr_block  = "0.0.0.0/0"
            }
        ]

        default-outbound = [
            {
                rule_number = 900
                rule_action = "allow"
                from_port   = 32768
                to_port     = 65535
                protocol    = "tcp"
                cidr_block  = "0.0.0.0/0"
            }
        ]

        public-inbound = [
            {
                rule_number = 100
                rule_action = "allow"
                from_port   = 80
                to_port     = 80
                protocol    = "tcp"
                cidr_block  = "0.0.0.0/0"
            },
            {
                rule_number = 110
                rule_action = "allow"
                from_port   = 443
                to_port     = 443
                protocol    = "tcp"
                cidr_block  = "0.0.0.0/0"
            },
            {
                rule_number = 120
                rule_action = "allow"
                from_port   = 22
                to_port     = 22
                protocol    = "tcp"
                cidr_block  = "0.0.0.0/0"
            },
            {
                rule_number     = 130
                rule_action     = "allow"
                from_port       = 80
                to_port         = 80
                protocol        = "tcp"
                ipv6_cidr_block = "::/0"
            },
            {
                rule_number     = 140
                rule_action     = "allow"
                from_port       = 443
                to_port         = 443
                protocol        = "tcp"
                ipv6_cidr_block = "::/0"
            },
            {
                rule_number     = 150
                rule_action     = "allow"
                from_port       = 22
                to_port         = 22
                protocol        = "tcp"
                ipv6_cidr_block = "::/0"
            }
        ]

        public-outbound = [
            {
                rule_number = 100
                rule_action = "allow"
                from_port   = 80
                to_port     = 80
                protocol    = "tcp"
                cidr_block  = "0.0.0.0/0"
            },
            {
                rule_number = 110
                rule_action = "allow"
                from_port   = 443
                to_port     = 443
                protocol    = "tcp"
                cidr_block  = "0.0.0.0/0"
            },
            {
                rule_number = 120
                rule_action = "allow"
                from_port   = 1433
                to_port     = 1433
                protocol    = "tcp"
                cidr_block  = module.vpc.vpc-cidr-block
            },
            {
                rule_number = 130
                rule_action = "allow"
                from_port   = 22
                to_port     = 22
                protocol    = "tcp"
                cidr_block  = module.vpc.vpc-cidr-block
            },
            {
                rule_number = 140
                rule_action = "allow"
                icmp_code   = -1
                icmp_type   = 8
                protocol    = "icmp"
                cidr_block  = module.vpc.vpc-cidr-block
            },
            {
                rule_number     = 150
                rule_action     = "allow"
                from_port       = 90
                to_port         = 90
                protocol        = "tcp"
                ipv6_cidr_block = "::/0"
            },
        ]

        elasticache-outbound = [
            {
                rule_number = 100
                rule_action = "allow"
                from_port   = 80
                to_port     = 80
                protocol    = "tcp"
                cidr_block  = "0.0.0.0/0"
            },
            {
                rule_number = 110
                rule_action = "allow"
                from_port   = 443
                to_port     = 443
                protocol    = "tcp"
                cidr_block  = "0.0.0.0/0"
            },
            {
                rule_number = 120
                rule_action = "allow"
                icmp_code   = -1
                icmp_type   = 12
                protocol    = "icmp"
                cidr_block  = module.vpc.vpc-cidr-block
            },
            {
                rule_number     = 130
                rule_action     = "allow"
                from_port       = 90
                to_port         = 90
                protocol        = "tcp"
                ipv6_cidr_block = "::/0"
            },
        ]

        private-database-inbound = [
            /// Mongo
            {
                rule_number = 100
                rule_action = "allow"
                from_port   = 27017
                to_port     = 27017
                protocol    = "tcp"
                cidr_block  = module.vpc.database-subnets-cidr-blocks[ 0 ]
            },
            {
                rule_number = 110
                rule_action = "allow"
                from_port   = 27017
                to_port     = 27017
                protocol    = "tcp"
                cidr_block  = module.vpc.database-subnets-cidr-blocks[ 1 ]
            },
            {
                rule_number = 120
                rule_action = "allow"
                from_port   = 27017
                to_port     = 27017
                protocol    = "tcp"
                cidr_block  = module.vpc.database-subnets-cidr-blocks[ 2 ]
            },
            /// MySQL
            {
                rule_number = 130
                rule_action = "allow"
                from_port   = 3306
                to_port     = 3306
                protocol    = "tcp"
                cidr_block  = module.vpc.database-subnets-cidr-blocks[ 0 ]
            },
            {
                rule_number = 140
                rule_action = "allow"
                from_port   = 3306
                to_port     = 3306
                protocol    = "tcp"
                cidr_block  = module.vpc.database-subnets-cidr-blocks[ 1 ]
            },
            {
                rule_number = 150
                rule_action = "allow"
                from_port   = 3306
                to_port     = 3306
                protocol    = "tcp"
                cidr_block  = module.vpc.database-subnets-cidr-blocks[ 2 ]
            }
        ]
    }
}

################################################################################
# VPC Module
################################################################################

module "vpc" {
    source = "./source"

    name = "${var.organization}-${var.environment}-${var.application}-${var.service}"

    cidr = "172.10.0.0/16"

    azs                 = [ "${var.region}a", "${var.region}b", "${var.region}c" ]
    private-subnets     = [ "172.10.1.0/24", "172.10.2.0/24", "172.10.3.0/24" ]
    public-subnets      = [ "172.10.11.0/24", "172.10.12.0/24", "172.10.13.0/24" ]
    database-subnets    = [ "172.10.21.0/24", "172.10.22.0/24", "172.10.23.0/24" ]
    elasticache-subnets = [ "172.10.31.0/24", "172.10.32.0/24", "172.10.33.0/24" ]

    enable-dhcp-options              = true
    dhcp-options-domain-name         = "ec2.internal"
    dhcp-options-domain-name-servers = [ "AmazonProvidedDNS", "127.0.0.1", "172.10.0.2" ]

    enable-dns-hostnames = true
    enable-dns-support   = true

    enable-ipv6 = true

    propagate-private-route-tables-vgw = true
    propagate-public-route-tables-vgw  = true

    enable-vpn-gateway = true

    create-database-subnet-route-table    = true
    create-elasticache-subnet-route-table = true

    manage-default-network-acl = true

    public-dedicated-network-acl = true
    public-inbound-acl-rules     = concat(local.acls[ "default-inbound" ], local.acls[ "public-inbound" ])
    public-outbound-acl-rules    = concat(local.acls[ "default-outbound" ], local.acls[ "public-outbound" ])

    elasticache-dedicated-network-acl = true
    elasticache-inbound-acl-rules    = concat(local.acls[ "default-inbound" ])
    elasticache-outbound-acl-rules    = concat(local.acls[ "default-outbound" ], local.acls[ "elasticache-outbound" ])

    private-dedicated-network-acl = false

    single-nat-gateway = true
    enable-nat-gateway = false

    # manage_default_network_acl = true
    # default_network_acl_tags   = { Name = "${local.name}-default" }

    # manage_default_route_table = true
    # default_route_table_tags   = { Name = "${local.name}-default" }

    # manage_default_security_group = true
    # default_security_group_tags   = { Name = "${local.name}-default" }

    # VPC Flow Logs (Cloudwatch log group and IAM role will be created)
    enable-flow-log                      = true
    create-flow-log-cloudwatch-log-group = true
    create-flow-log-cloudwatch-iam-role  = true
    flow-log-max-aggregation-interval    = 60
}
