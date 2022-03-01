variable "organization" {
    description = "Organization Name"
    default     = "Organization"
    type        = string
}

variable "environment" {
    description = "Target Cloud Environment"
    default     = "Development"
    type        = string
}

variable "create-vpc" {
    description = "Controls if VPC should be created (it affects almost all resources)"
    type        = bool
    default     = true
}

variable "name" {
    description = "Name to be used on all the resources as identifier"
    type        = string
    default     = ""
}

variable "cidr" {
    description = "The CIDR block for the VPC. Default value is a valid CIDR, but not acceptable by AWS and should be overridden"
    type        = string
    default     = "0.0.0.0/0"
}

variable "enable-ipv6" {
    description = "Requests an Amazon-provided IPv6 CIDR block with a /56 prefix length for the VPC. Accounts cannot specify the range of IP addresses, or the size of the CIDR block."
    type        = bool
    default     = true
}

variable "private-subnet-ipv6-prefixes" {
    description = "Assigns IPv6 private subnet id based on the Amazon provided /56 prefix base 10 integer (0-256). Must be of equal length to the corresponding IPv4 subnet list"
    type        = list(string)
    default     = [ ]
}

variable "public-subnet-ipv6-prefixes" {
    description = "Assigns IPv6 public subnet id based on the Amazon provided /56 prefix base 10 integer (0-256). Must be of equal length to the corresponding IPv4 subnet list"
    type        = list(string)
    default     = [ ]
}

variable "database-subnet-ipv6-prefixes" {
    description = "Assigns IPv6 database subnet id based on the Amazon provided /56 prefix base 10 integer (0-256). Must be of equal length to the corresponding IPv4 subnet list"
    type        = list(string)
    default     = [ ]
}

variable "elasticache-subnet-ipv6-prefixes" {
    description = "Assigns IPv6 elasticache subnet id based on the Amazon provided /56 prefix base 10 integer (0-256). Must be of equal length to the corresponding IPv4 subnet list"
    type        = list(string)
    default     = [ ]
}

variable "assign-ipv6-address-on-creation" {
    description = "Assign IPv6 address on subnet, must be disabled to change IPv6 CIDRs. This is the IPv6 equivalent of map-public-ip-on-launch"
    type        = bool
    default     = false
}

variable "private-subnet-assign-ipv6-address-on-creation" {
    description = "Assign IPv6 address on private subnet, must be disabled to change IPv6 CIDRs. This is the IPv6 equivalent of map-public-ip-on-launch"
    type        = bool
    default     = null
}

variable "public-subnet-assign-ipv6-address-on-creation" {
    description = "Assign IPv6 address on public subnet, must be disabled to change IPv6 CIDRs. This is the IPv6 equivalent of map-public-ip-on-launch"
    type        = bool
    default     = null
}

variable "database-subnet-assign-ipv6-address-on-creation" {
    description = "Assign IPv6 address on database subnet, must be disabled to change IPv6 CIDRs. This is the IPv6 equivalent of map-public-ip-on-launch"
    type        = bool
    default     = null
}

variable "elasticache-subnet-assign-ipv6-address-on-creation" {
    description = "Assign IPv6 address on elasticache subnet, must be disabled to change IPv6 CIDRs. This is the IPv6 equivalent of map-public-ip-on-launch"
    type        = bool
    default     = null
}

variable "secondary-cidr-blocks" {
    description = "List of secondary CIDR blocks to associate with the VPC to extend the IP Address pool"
    type        = list(string)
    default     = [ ]
}

variable "instance-tenancy" {
    description = "A tenancy option for instances launched into the VPC"
    type        = string
    default     = "default"
}

variable "public-subnet-suffix" {
    description = "Suffix to append to public subnets name"
    type        = string
    default     = "Public"
}

variable "private-subnet-suffix" {
    description = "Suffix to append to private subnets name"
    type        = string
    default     = "Private"
}

variable "database-subnet-suffix" {
    description = "Suffix to append to database subnets name"
    type        = string
    default     = "Private-Database"
}

variable "elasticache-subnet-suffix" {
    description = "Suffix to append to elasticache subnets name"
    type        = string
    default     = "Elasticache"
}

variable "public-subnets" {
    description = "A list of public subnets inside the VPC"
    type        = list(string)
    default     = [ ]
}

variable "private-subnets" {
    description = "A list of private subnets inside the VPC"
    type        = list(string)
    default     = [ ]
}

variable "database-subnets" {
    description = "A list of database subnets"
    type        = list(string)
    default     = [ ]
}

variable "elasticache-subnets" {
    description = "A list of elasticache subnets"
    type        = list(string)
    default     = [ ]
}

variable "create-database-subnet-route-table" {
    description = "Controls if separate route table for database should be created"
    type        = bool
    default     = false
}

variable "create-elasticache-subnet-route-table" {
    description = "Controls if separate route table for elasticache should be created"
    type        = bool
    default     = false
}

variable "create-database-subnet-group" {
    description = "Controls if database subnet group should be created (n.b. database-subnets must also be set)"
    type        = bool
    default     = true
}

variable "create-elasticache-subnet-group" {
    description = "Controls if elasticache subnet group should be created"
    type        = bool
    default     = true
}

variable "create-database-internet-gateway-route" {
    description = "Controls if an internet gateway route for public database access should be created"
    type        = bool
    default     = false
}

variable "create-database-nat-gateway-route" {
    description = "Controls if a nat gateway route should be created to give internet access to the database subnets"
    type        = bool
    default     = false
}

variable "azs" {
    description = "A list of availability zones names or ids in the region"
    type        = list(string)
    default     = [ ]
}

variable "enable-dns-hostnames" {
    description = "Should be true to enable DNS hostnames in the VPC"
    type        = bool
    default     = false
}

variable "enable-dns-support" {
    description = "Should be true to enable DNS support in the VPC"
    type        = bool
    default     = true
}

variable "enable-classiclink" {
    description = "Should be true to enable ClassicLink for the VPC. Only valid in regions and accounts that support EC2 Classic."
    type        = bool
    default     = null
}

variable "enable-classiclink-dns-support" {
    description = "Should be true to enable ClassicLink DNS Support for the VPC. Only valid in regions and accounts that support EC2 Classic."
    type        = bool
    default     = null
}

variable "enable-nat-gateway" {
    description = "Should be true if Account requires to provision NAT Gateways for each of the Account's private networks"
    type        = bool
    default     = false
}

variable "nat-gateway-destination-cidr-block" {
    description = "Used to pass a custom destination route for private NAT Gateway. If not specified, the default 0.0.0.0/0 is used as a destination route."
    type        = string
    default     = "0.0.0.0/0"
}

variable "single-nat-gateway" {
    description = "Should be true if Account requires to provision a single shared NAT Gateway across all of Account's private networks"
    type        = bool
    default     = false
}

variable "one-nat-gateway-per-az" {
    description = "Should be true if Account requires only one NAT Gateway per availability zone. Requires `var.azs` to be set, and the number of `public-subnets` created to be greater than or equal to the number of availability zones specified in `var.azs`."
    type        = bool
    default     = false
}

variable "reuse-nat-ips" {
    description = "Should be true if Account doesn't want EIPs to be created for Account's NAT Gateways and will instead pass them in via the 'external-nat-ip-ids' variable"
    type        = bool
    default     = false
}

variable "external-nat-ip-ids" {
    description = "List of EIP IDs to be assigned to the NAT Gateways (used in combination with reuse-nat-ips)"
    type        = list(string)
    default     = [ ]
}

variable "external-nat-ips" {
    description = "List of EIPs to be used for `nat-public-ips` output (used in combination with reuse-nat-ips and external-nat-ip-ids)"
    type        = list(string)
    default     = [ ]
}

variable "map-public-ip-on-launch" {
    description = "Should be false if Account does not want to auto-assign public IP on launch"
    type        = bool
    default     = true
}

variable "customer-gateways" {
    description = "Maps of Customer Gateway's attributes (BGP ASN and Gateway's Internet-routable external IP address)"
    type        = map(map(any))
    default     = {}
}

variable "enable-vpn-gateway" {
    description = "Should be true if Account requires to create a new VPN Gateway resource and attach it to the VPC"
    type        = bool
    default     = false
}

variable "vpn-gateway-id" {
    description = "ID of VPN Gateway to attach to the VPC"
    type        = string
    default     = ""
}

variable "amazon-side-asn" {
    description = "The Autonomous System Number (ASN) for the Amazon side of the gateway. By default the virtual private gateway is created with the current default Amazon ASN."
    type        = string
    default     = "64512"
}

variable "vpn-gateway-az" {
    description = "The Availability Zone for the VPN Gateway"
    type        = string
    default     = null
}

variable "propagate-private-route-tables-vgw" {
    description = "Should be true if Account requires route table propagation"
    type        = bool
    default     = false
}

variable "propagate-public-route-tables-vgw" {
    description = "Should be true if Account requires route table propagation"
    type        = bool
    default     = false
}

variable "manage-default-route-table" {
    description = "Should be true to manage default route table"
    type        = bool
    default     = false
}

variable "default-route-table-name" {
    description = "Name to be used on the default route table"
    type        = string
    default     = null
}

variable "default-route-table-propagating-vgws" {
    description = "List of virtual gateways for propagation"
    type        = list(string)
    default     = [ ]
}

variable "default-route-table-routes" {
    description = "Configuration block of routes. See https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/default-route-table#route"
    type        = list(map(string))
    default     = [ ]
}

variable "default-route-table-tags" {
    description = "Additional tags for the default route table"
    type        = map(string)
    default     = {}
}

variable "tags" {
    description = "A map of tags to add to all resources"
    type        = map(string)
    default     = {}
}

variable "vpc-tags" {
    description = "Additional tags for the VPC"
    type        = map(string)
    default     = {}
}

variable "igw-tags" {
    description = "Additional tags for the internet gateway"
    type        = map(string)
    default     = {}
}

variable "public-subnet-tags" {
    description = "Additional tags for the public subnets"
    type        = map(string)
    default     = {}
}

variable "private-subnet-tags" {
    description = "Additional tags for the private subnets"
    type        = map(string)
    default     = {}
}

variable "public-route-table-tags" {
    description = "Additional tags for the public route tables"
    type        = map(string)
    default     = {}
}

variable "private-route-table-tags" {
    description = "Additional tags for the private route tables"
    type        = map(string)
    default     = {}
}

variable "database-route-table-tags" {
    description = "Additional tags for the database route tables"
    type        = map(string)
    default     = {}
}

variable "elasticache-route-table-tags" {
    description = "Additional tags for the elasticache route tables"
    type        = map(string)
    default     = {}
}

variable "database-subnet-group-name" {
    description = "Name of database subnet group"
    type        = string
    default     = null
}

variable "database-subnet-tags" {
    description = "Additional tags for the database subnets"
    type        = map(string)
    default     = {}
}

variable "database-subnet-group-tags" {
    description = "Additional tags for the database subnet group"
    type        = map(string)
    default     = {}
}

variable "elasticache-subnet-group-name" {
    description = "Name of elasticache subnet group"
    type        = string
    default     = null
}

variable "elasticache-subnet-group-tags" {
    description = "Additional tags for the elasticache subnet group"
    type        = map(string)
    default     = {}
}

variable "elasticache-subnet-tags" {
    description = "Additional tags for the elasticache subnets"
    type        = map(string)
    default     = {}
}

variable "public-acl-tags" {
    description = "Additional tags for the public subnets network ACL"
    type        = map(string)
    default     = {}
}

variable "private-acl-tags" {
    description = "Additional tags for the private subnets network ACL"
    type        = map(string)
    default     = {}
}

variable "database-acl-tags" {
    description = "Additional tags for the database subnets network ACL"
    type        = map(string)
    default     = {}
}

variable "elasticache-acl-tags" {
    description = "Additional tags for the elasticache subnets network ACL"
    type        = map(string)
    default     = {}
}

variable "dhcp-options-tags" {
    description = "Additional tags for the DHCP option set (requires enable-dhcp-options set to true)"
    type        = map(string)
    default     = {}
}

variable "nat-gateway-tags" {
    description = "Additional tags for the NAT gateways"
    type        = map(string)
    default     = {}
}

variable "nat-eip-tags" {
    description = "Additional tags for the NAT EIP"
    type        = map(string)
    default     = {}
}

variable "customer-gateway-tags" {
    description = "Additional tags for the Customer Gateway"
    type        = map(string)
    default     = {}
}

variable "vpn-gateway-tags" {
    description = "Additional tags for the VPN gateway"
    type        = map(string)
    default     = {}
}

variable "vpc-flow-log-tags" {
    description = "Additional tags for the VPC Flow Logs"
    type        = map(string)
    default     = {}
}

variable "vpc-flow-log-permissions-boundary" {
    description = "The ARN of the Permissions Boundary for the VPC Flow Log IAM Role"
    type        = string
    default     = null
}

variable "enable-dhcp-options" {
    description = "Should be true if Account requires to specify a DHCP options set with a custom domain name, DNS servers, NTP servers, netbios servers, and/or netbios server type"
    type        = bool
    default     = false
}

variable "dhcp-options-domain-name" {
    description = "Specifies DNS name for DHCP options set (requires enable-dhcp-options set to true)"
    type        = string
    default     = ""
}

variable "dhcp-options-domain-name-servers" {
    description = "Specify a list of DNS server addresses for DHCP options set, default to AWS provided (requires enable-dhcp-options set to true)"
    type        = list(string)
    default     = [ "AmazonProvidedDNS" ]
}

variable "dhcp-options-ntp-servers" {
    description = "Specify a list of NTP servers for DHCP options set (requires enable-dhcp-options set to true)"
    type        = list(string)
    default     = [ ]
}

variable "dhcp-options-netbios-name-servers" {
    description = "Specify a list of netbios servers for DHCP options set (requires enable-dhcp-options set to true)"
    type        = list(string)
    default     = [ ]
}

variable "dhcp-options-netbios-node-type" {
    description = "Specify netbios node-type for DHCP options set (requires enable-dhcp-options set to true)"
    type        = string
    default     = ""
}

variable "manage-default-vpc" {
    description = "Should be true to adopt and manage Default VPC"
    type        = bool
    default     = false
}

variable "default-vpc-name" {
    description = "Name to be used on the Default VPC"
    type        = string
    default     = null
}

variable "default-vpc-enable-dns-support" {
    description = "Should be true to enable DNS support in the Default VPC"
    type        = bool
    default     = true
}

variable "default-vpc-enable-dns-hostnames" {
    description = "Should be true to enable DNS hostnames in the Default VPC"
    type        = bool
    default     = false
}

variable "default-vpc-enable-classiclink" {
    description = "Should be true to enable ClassicLink in the Default VPC"
    type        = bool
    default     = false
}

variable "default-vpc-tags" {
    description = "Additional tags for the Default VPC"
    type        = map(string)
    default     = {}
}

variable "manage-default-network-acl" {
    description = "Should be true to adopt and manage Default Network ACL"
    type        = bool
    default     = false
}

variable "default-network-acl-name" {
    description = "Name to be used on the Default Network ACL"
    type        = string
    default     = null
}

variable "default-network-acl-tags" {
    description = "Additional tags for the Default Network ACL"
    type        = map(string)
    default     = {}
}

variable "public-dedicated-network-acl" {
    description = "Whether to use dedicated network ACL (not default) and custom rules for public subnets"
    type        = bool
    default     = false
}

variable "private-dedicated-network-acl" {
    description = "Whether to use dedicated network ACL (not default) and custom rules for private subnets"
    type        = bool
    default     = false
}

variable "database-dedicated-network-acl" {
    description = "Whether to use dedicated network ACL (not default) and custom rules for database subnets"
    type        = bool
    default     = false
}

variable "elasticache-dedicated-network-acl" {
    description = "Whether to use dedicated network ACL (not default) and custom rules for elasticache subnets"
    type        = bool
    default     = false
}

variable "public-inbound-acl-rules" {
    description = "Public subnets inbound network ACLs"
    type        = list(map(string))

    default = [
        {
            rule-number = 100
            rule-action = "allow"
            from-port   = 0
            to-port     = 0
            protocol    = "-1"
            cidr-block  = "0.0.0.0/0"
        },
    ]
}

variable "public-outbound-acl-rules" {
    description = "Public subnets outbound network ACLs"
    type        = list(map(string))

    default = [
        {
            rule-number = 100
            rule-action = "allow"
            from-port   = 0
            to-port     = 0
            protocol    = "-1"
            cidr-block  = "0.0.0.0/0"
        },
    ]
}

variable "private-inbound-acl-rules" {
    description = "Private subnets inbound network ACLs"
    type        = list(map(string))

    default = [
        {
            rule-number = 100
            rule-action = "allow"
            from-port   = 0
            to-port     = 0
            protocol    = "-1"
            cidr-block  = "0.0.0.0/0"
        },
    ]
}

variable "private-outbound-acl-rules" {
    description = "Private subnets outbound network ACLs"
    type        = list(map(string))

    default = [
        {
            rule-number = 100
            rule-action = "allow"
            from-port   = 0
            to-port     = 0
            protocol    = "-1"
            cidr-block  = "0.0.0.0/0"
        },
    ]
}

variable "database-inbound-acl-rules" {
    description = "Database subnets inbound network ACL rules"
    type        = list(map(string))

    default = [
        {
            rule-number = 100
            rule-action = "allow"
            from-port   = 0
            to-port     = 0
            protocol    = "-1"
            cidr-block  = "0.0.0.0/0"
        },
    ]
}

variable "database-outbound-acl-rules" {
    description = "Database subnets outbound network ACL rules"
    type        = list(map(string))

    default = [
        {
            rule-number = 100
            rule-action = "allow"
            from-port   = 0
            to-port     = 0
            protocol    = "-1"
            cidr-block  = "0.0.0.0/0"
        },
    ]
}

variable "elasticache-inbound-acl-rules" {
    description = "Elasticache subnets inbound network ACL rules"
    type        = list(map(string))

    default = [
        {
            rule-number = 100
            rule-action = "allow"
            from-port   = 0
            to-port     = 0
            protocol    = "-1"
            cidr-block  = "0.0.0.0/0"
        },
    ]
}

variable "elasticache-outbound-acl-rules" {
    description = "Elasticache subnets outbound network ACL rules"
    type        = list(map(string))

    default = [
        {
            rule-number = 100
            rule-action = "allow"
            from-port   = 0
            to-port     = 0
            protocol    = "-1"
            cidr-block  = "0.0.0.0/0"
        },
    ]
}

variable "manage-default-security-group" {
    description = "Should be true to adopt and manage default security group"
    type        = bool
    default     = false
}

variable "default-security-group-name" {
    description = "Name to be used on the default security group"
    type        = string
    default     = null
}

variable "default-security-group-ingress" {
    description = "List of maps of ingress rules to set on the default security group"
    type        = list(map(string))
    default     = [ ]
}

variable "enable-flow-log" {
    description = "Whether or not to enable VPC Flow Logs"
    type        = bool
    default     = false
}

variable "default-security-group-egress" {
    description = "List of maps of egress rules to set on the default security group"
    type        = list(map(string))
    default     = [ ]
}

variable "default-security-group-tags" {
    description = "Additional tags for the default security group"
    type        = map(string)
    default     = {}
}

variable "create-flow-log-cloudwatch-log-group" {
    description = "Whether to create CloudWatch log group for VPC Flow Logs"
    type        = bool
    default     = false
}

variable "create-flow-log-cloudwatch-iam-role" {
    description = "Whether to create IAM role for VPC Flow Logs"
    type        = bool
    default     = false
}

variable "flow-log-traffic-type" {
    description = "The type of traffic to capture. Valid values: ACCEPT, REJECT, ALL."
    type        = string
    default     = "ALL"
}

variable "flow-log-destination-type" {
    description = "Type of flow log destination. Can be s3 or cloud-watch-logs."
    type        = string
    default     = "cloud-watch-logs"
}

variable "flow-log-log-format" {
    description = "The fields to include in the flow log record, in the order in which they should appear."
    type        = string
    default     = null
}

variable "flow-log-destination-arn" {
    description = "The ARN of the CloudWatch log group or S3 bucket where VPC Flow Logs will be pushed. If this ARN is a S3 bucket the appropriate permissions need to be set on that bucket's policy. When create-flow-log-cloudwatch-log-group is set to false this argument must be provided."
    type        = string
    default     = ""
}

variable "flow-log-cloudwatch-iam-role-arn" {
    description = "The ARN for the IAM role that's used to post flow logs to a CloudWatch Logs log group. When flow-log-destination-arn is set to ARN of Cloudwatch Logs, this argument needs to be provided."
    type        = string
    default     = ""
}

variable "flow-log-cloudwatch-log-group-name-prefix" {
    description = "Specifies the name prefix of CloudWatch Log Group for VPC flow logs."
    type        = string
    default     = "/aws/vpc-flow-log/"
}

variable "flow-log-cloudwatch-log-group-retention-in-days" {
    description = "Specifies the number of days Account wants to retain log events in the specified log group for VPC flow logs."
    type        = number
    default     = null
}

variable "flow-log-cloudwatch-log-group-kms-key-id" {
    description = "The ARN of the KMS Key to use when encrypting log data for VPC flow logs."
    type        = string
    default     = null
}

variable "flow-log-max-aggregation-interval" {
    description = "The maximum interval of time during which a flow of packets is captured and aggregated into a flow log record. Valid Values: `60` seconds or `600` seconds."
    type        = number
    default     = 600
}

variable "create-igw" {
    description = "Controls if an Internet Gateway is created for public subnets and the related routes that connect them."
    type        = bool
    default     = true
}

variable "create-egress-only-igw" {
    description = "Controls if an Egress Only Internet Gateway is created and its related routes."
    type        = bool
    default     = true
}

variable "flow-log-file-format" {
    description = "(Optional) The format for the flow log. Valid values: `plain-text`, `parquet`."
    type        = string
    default     = "parquet"
}

variable "flow-log-hive-compatible-partitions" {
    description = "(Optional) Indicates whether to use Hive-compatible prefixes for flow logs stored in Amazon S3."
    type        = bool
    default     = false
}

variable "flow-log-per-hour-partition" {
    description = "(Optional) Indicates whether to partition the flow log per hour. This reduces the cost and response time for queries."
    type        = bool
    default     = true
}
