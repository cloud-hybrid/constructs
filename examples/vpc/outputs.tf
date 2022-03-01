output "vpc-id" {
  description = "The ID of the VPC"
  value       = module.vpc.vpc-id
}

output "vpc-arn" {
  description = "The ARN of the VPC"
  value       = module.vpc.vpc-arn
}

output "vpc-cidr-block" {
  description = "The CIDR block of the VPC"
  value       = module.vpc.vpc-cidr-block
}

output "vpc-instance-tenancy" {
  description = "Tenancy of instances spin up within VPC"
  value       = module.vpc.vpc-instance-tenancy
}

output "vpc-enable-dns-support" {
  description = "Whether or not the VPC has DNS support"
  value       = module.vpc.vpc-enable-dns-support
}

output "vpc-enable-dns-hostnames" {
  description = "Whether or not the VPC has DNS hostname support"
  value       = module.vpc.vpc-enable-dns-hostnames
}

output "vpc-main-route-table-id" {
  description = "The ID of the main route table associated with this VPC"
  value       = module.vpc.vpc-main-route-table-id
}

output "vpc-ipv6-association-id" {
  description = "The association ID for the IPv6 CIDR block"
  value       = module.vpc.vpc-ipv6-association-id
}

output "vpc-ipv6-cidr-block" {
  description = "The IPv6 CIDR block"
  value       = module.vpc.vpc-ipv6-cidr-block
}

output "vpc-secondary-cidr-blocks" {
  description = "List of secondary CIDR blocks of the VPC"
  value       = module.vpc.vpc-secondary-cidr-blocks
}

output "vpc-owner-id" {
  description = "The ID of the AWS account that owns the VPC"
  value       = module.vpc.vpc-owner-id
}

output "private-subnets" {
  description = "List of IDs of private subnets"
  value       = module.vpc.private-subnets
}

output "private-subnet-arns" {
  description = "List of ARNs of private subnets"
  value       = module.vpc.private-subnet-arns
}

output "private-subnets-cidr-blocks" {
  description = "List of cidr-blocks of private subnets"
  value       = module.vpc.private-subnets-cidr-blocks
}

output "private-subnets-ipv6-cidr-blocks" {
  description = "List of IPv6 cidr-blocks of private subnets in an IPv6 enabled VPC"
  value       = module.vpc.private-subnets-ipv6-cidr-blocks
}

output "public-subnets" {
  description = "List of IDs of public subnets"
  value       = module.vpc.public-subnets
}

output "public-subnet-arns" {
  description = "List of ARNs of public subnets"
  value       = module.vpc.public-subnet-arns
}

output "public-subnets-cidr-blocks" {
  description = "List of cidr-blocks of public subnets"
  value       = module.vpc.public-subnets-cidr-blocks
}

output "public-subnets-ipv6-cidr-blocks" {
  description = "List of IPv6 cidr-blocks of public subnets in an IPv6 enabled VPC"
  value       = module.vpc.public-subnets-ipv6-cidr-blocks
}

output "database-subnets" {
  description = "List of IDs of database subnets"
  value       = module.vpc.database-subnets
}

output "database-subnet-arns" {
  description = "List of ARNs of database subnets"
  value       = module.vpc.database-subnet-arns
}

output "database-subnets-cidr-blocks" {
  description = "List of cidr-blocks of database subnets"
  value       = module.vpc.database-subnets-cidr-blocks
}

output "database-subnets-ipv6-cidr-blocks" {
  description = "List of IPv6 cidr-blocks of database subnets in an IPv6 enabled VPC"
  value       = module.vpc.database-subnets-ipv6-cidr-blocks
}

output "database-subnet-group" {
  description = "ID of database subnet group"
  value       = module.vpc.database-subnet-group
}

output "database-subnet-group-name" {
  description = "Name of database subnet group"
  value       = module.vpc.database-subnet-group-name
}

output "elasticache-subnets" {
  description = "List of IDs of elasticache subnets"
  value       = module.vpc.elasticache-subnets
}

output "elasticache-subnet-arns" {
  description = "List of ARNs of elasticache subnets"
  value       = module.vpc.elasticache-subnet-arns
}

output "elasticache-subnets-cidr-blocks" {
  description = "List of cidr-blocks of elasticache subnets"
  value       = module.vpc.elasticache-subnets-cidr-blocks
}

output "elasticache-subnets-ipv6-cidr-blocks" {
  description = "List of IPv6 cidr-blocks of elasticache subnets in an IPv6 enabled VPC"
  value       = module.vpc.elasticache-subnets-ipv6-cidr-blocks
}

output "elasticache-subnet-group" {
  description = "ID of elasticache subnet group"
  value       = module.vpc.elasticache-subnet-group
}

output "elasticache-subnet-group-name" {
  description = "Name of elasticache subnet group"
  value       = module.vpc.elasticache-subnet-group-name
}

output "public-route-table-ids" {
  description = "List of IDs of public route tables"
  value       = module.vpc.public-route-table-ids
}

output "private-route-table-ids" {
  description = "List of IDs of private route tables"
  value       = module.vpc.private-route-table-ids
}

output "database-route-table-ids" {
  description = "List of IDs of database route tables"
  value       = module.vpc.database-route-table-ids
}

output "public-internet-gateway-route-id" {
  description = "ID of the internet gateway route"
  value       = module.vpc.public-internet-gateway-route-id
}

output "public-internet-gateway-ipv6-route-id" {
  description = "ID of the IPv6 internet gateway route"
  value       = module.vpc.public-internet-gateway-ipv6-route-id
}

output "database-internet-gateway-route-id" {
  description = "ID of the database internet gateway route"
  value       = module.vpc.database-internet-gateway-route-id
}

output "database-nat-gateway-route-ids" {
  description = "List of IDs of the database nat gateway route"
  value       = module.vpc.database-nat-gateway-route-ids
}

output "database-ipv6-egress-route-id" {
  description = "ID of the database IPv6 egress route"
  value       = module.vpc.database-ipv6-egress-route-id
}

output "private-nat-gateway-route-ids" {
  description = "List of IDs of the private nat gateway route"
  value       = module.vpc.private-nat-gateway-route-ids
}

output "private-ipv6-egress-route-ids" {
  description = "List of IDs of the ipv6 egress route"
  value       = module.vpc.private-ipv6-egress-route-ids
}

output "private-route-table-association-ids" {
  description = "List of IDs of the private route table association"
  value       = module.vpc.private-route-table-association-ids
}

output "database-route-table-association-ids" {
  description = "List of IDs of the database route table association"
  value       = module.vpc.database-route-table-association-ids
}

output "public-route-table-association-ids" {
  description = "List of IDs of the public route table association"
  value       = module.vpc.public-route-table-association-ids
}

output "dhcp-options-id" {
  description = "The ID of the DHCP options"
  value       = module.vpc.dhcp-options-id
}

output "nat-ids" {
  description = "List of allocation ID of Elastic IPs created for AWS NAT Gateway"
  value       = module.vpc.nat-ids
}

output "nat-public-ips" {
  description = "List of public Elastic IPs created for AWS NAT Gateway"
  value       = module.vpc.nat-public-ips
}

output "natgw-ids" {
  description = "List of NAT Gateway IDs"
  value       = module.vpc.natgw-ids
}

output "igw-id" {
  description = "The ID of the Internet Gateway"
  value       = module.vpc.igw-id
}

output "igw-arn" {
  description = "The ARN of the Internet Gateway"
  value       = module.vpc.igw-arn
}

output "egress-only-internet-gateway-id" {
  description = "The ID of the egress only Internet Gateway"
  value       = module.vpc.egress-only-internet-gateway-id
}

output "vgw-id" {
  description = "The ID of the VPN Gateway"
  value       = module.vpc.vgw-id
}

output "vgw-arn" {
  description = "The ARN of the VPN Gateway"
  value       = module.vpc.vgw-arn
}

output "public-network-acl-id" {
  description = "ID of the public network ACL"
  value       = module.vpc.public-network-acl-id
}

output "public-network-acl-arn" {
  description = "ARN of the public network ACL"
  value       = module.vpc.public-network-acl-arn
}

output "private-network-acl-id" {
  description = "ID of the private network ACL"
  value       = module.vpc.private-network-acl-id
}

output "private-network-acl-arn" {
  description = "ARN of the private network ACL"
  value       = module.vpc.private-network-acl-arn
}

output "database-network-acl-id" {
  description = "ID of the database network ACL"
  value       = module.vpc.database-network-acl-id
}

output "database-network-acl-arn" {
  description = "ARN of the database network ACL"
  value       = module.vpc.database-network-acl-arn
}

output "elasticache-network-acl-id" {
  description = "ID of the elasticache network ACL"
  value       = module.vpc.elasticache-network-acl-id
}

output "elasticache-network-acl-arn" {
  description = "ARN of the elasticache network ACL"
  value       = module.vpc.elasticache-network-acl-arn
}

# VPC flow log
output "vpc-flow-log-id" {
  description = "The ID of the Flow Log resource"
  value       = module.vpc.vpc-flow-log-id
}

output "vpc-flow-log-destination-arn" {
  description = "The ARN of the destination for VPC Flow Logs"
  value       = module.vpc.vpc-flow-log-destination-arn
}

output "vpc-flow-log-destination-type" {
  description = "The type of the destination for VPC Flow Logs"
  value       = module.vpc.vpc-flow-log-destination-type
}

output "vpc-flow-log-cloudwatch-iam-role-arn" {
  description = "The ARN of the IAM role used when pushing logs to Cloudwatch log group"
  value       = module.vpc.vpc-flow-log-cloudwatch-iam-role-arn
}
