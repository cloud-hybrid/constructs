output "vpc-id" {
  description = "The ID of the VPC"
  value       = try(aws_vpc.this[0].id, "")
}

output "vpc-arn" {
  description = "The ARN of the VPC"
  value       = try(aws_vpc.this[0].arn, "")
}

output "vpc-cidr-block" {
  description = "The CIDR block of the VPC"
  value       = try(aws_vpc.this[0].cidr_block, "")
}

output "default-security-group-id" {
  description = "The ID of the security group created by default on VPC creation"
  value       = try(aws_vpc.this[0].default_security_group_id, "")
}

output "default-network-acl-id" {
  description = "The ID of the default network ACL"
  value       = try(aws_vpc.this[0].default_network_acl_id, "")
}

output "default-route-table-id" {
  description = "The ID of the default route table"
  value       = try(aws_vpc.this[0].default_route_table_id, "")
}

output "vpc-instance-tenancy" {
  description = "Tenancy of instances spin up within VPC"
  value       = try(aws_vpc.this[0].instance_tenancy, "")
}

output "vpc-enable-dns-support" {
  description = "Whether or not the VPC has DNS support"
  value       = try(aws_vpc.this[0].enable_dns_support, "")
}

output "vpc-enable-dns-hostnames" {
  description = "Whether or not the VPC has DNS hostname support"
  value       = try(aws_vpc.this[0].enable_dns_hostnames, "")
}

output "vpc-main-route-table-id" {
  description = "The ID of the main route table associated with this VPC"
  value       = try(aws_vpc.this[0].main_route_table_id, "")
}

output "vpc-ipv6-association-id" {
  description = "The association ID for the IPv6 CIDR block"
  value       = try(aws_vpc.this[0].ipv6_association_id, "")
}

output "vpc-ipv6-cidr-block" {
  description = "The IPv6 CIDR block"
  value       = try(aws_vpc.this[0].ipv6_cidr_block, "")
}

output "vpc-secondary-cidr-blocks" {
  description = "List of secondary CIDR blocks of the VPC"
  value       = aws_vpc_ipv4_cidr_block_association.this[*].cidr_block
}

output "vpc-owner-id" {
  description = "The ID of the AWS account that owns the VPC"
  value       = try(aws_vpc.this[0].owner_id, "")
}

output "private-subnets" {
  description = "List of IDs of private subnets"
  value       = aws_subnet.private[*].id
}

output "private-subnet-arns" {
  description = "List of ARNs of private subnets"
  value       = aws_subnet.private[*].arn
}

output "private-subnets-cidr-blocks" {
  description = "List of cidr_blocks of private subnets"
  value       = aws_subnet.private[*].cidr_block
}

output "private-subnets-ipv6-cidr-blocks" {
  description = "List of IPv6 cidr_blocks of private subnets in an IPv6 enabled VPC"
  value       = aws_subnet.private[*].ipv6_cidr_block
}

output "public-subnets" {
  description = "List of IDs of public subnets"
  value       = aws_subnet.public[*].id
}

output "public-subnet-arns" {
  description = "List of ARNs of public subnets"
  value       = aws_subnet.public[*].arn
}

output "public-subnets-cidr-blocks" {
  description = "List of cidr_blocks of public subnets"
  value       = aws_subnet.public[*].cidr_block
}

output "public-subnets-ipv6-cidr-blocks" {
  description = "List of IPv6 cidr_blocks of public subnets in an IPv6 enabled VPC"
  value       = aws_subnet.public[*].ipv6_cidr_block
}

output "database-subnets" {
  description = "List of IDs of database subnets"
  value       = aws_subnet.database[*].id
}

output "database-subnet-arns" {
  description = "List of ARNs of database subnets"
  value       = aws_subnet.database[*].arn
}

output "database-subnets-cidr-blocks" {
  description = "List of cidr_blocks of database subnets"
  value       = aws_subnet.database[*].cidr_block
}

output "database-subnets-ipv6-cidr-blocks" {
  description = "List of IPv6 cidr_blocks of database subnets in an IPv6 enabled VPC"
  value       = aws_subnet.database[*].ipv6_cidr_block
}

output "database-subnet-group" {
  description = "ID of database subnet group"
  value       = try(aws_db_subnet_group.database[0].id, "")
}

output "database-subnet-group-name" {
  description = "Name of database subnet group"
  value       = try(aws_db_subnet_group.database[0].name, "")
}

output "elasticache-subnets" {
  description = "List of IDs of elasticache subnets"
  value       = aws_subnet.elasticache[*].id
}

output "elasticache-subnet-arns" {
  description = "List of ARNs of elasticache subnets"
  value       = aws_subnet.elasticache[*].arn
}

output "elasticache-subnets-cidr-blocks" {
  description = "List of cidr_blocks of elasticache subnets"
  value       = aws_subnet.elasticache[*].cidr_block
}

output "elasticache-subnets-ipv6-cidr-blocks" {
  description = "List of IPv6 cidr_blocks of elasticache subnets in an IPv6 enabled VPC"
  value       = aws_subnet.elasticache[*].ipv6_cidr_block
}

output "elasticache-subnet-group" {
  description = "ID of elasticache subnet group"
  value       = try(aws_elasticache_subnet_group.elasticache[0].id, "")
}

output "elasticache-subnet-group-name" {
  description = "Name of elasticache subnet group"
  value       = try(aws_elasticache_subnet_group.elasticache[0].name, "")
}

output "public-route-table-ids" {
  description = "List of IDs of public route tables"
  value       = aws_route_table.public[*].id
}

output "private-route-table-ids" {
  description = "List of IDs of private route tables"
  value       = aws_route_table.private[*].id
}

output "database-route-table-ids" {
  description = "List of IDs of database route tables"
  value       = try(coalescelist(aws_route_table.database[*].id, aws_route_table.private[*].id), [])
}

output "public-internet-gateway-route-id" {
  description = "ID of the internet gateway route"
  value       = try(aws_route.public_internet_gateway[0].id, "")
}

output "public-internet-gateway-ipv6-route-id" {
  description = "ID of the IPv6 internet gateway route"
  value       = try(aws_route.public_internet_gateway_ipv6[0].id, "")
}

output "database-internet-gateway-route-id" {
  description = "ID of the database internet gateway route"
  value       = try(aws_route.database_internet_gateway[0].id, "")
}

output "database-nat-gateway-route-ids" {
  description = "List of IDs of the database nat gateway route"
  value       = aws_route.database_nat_gateway[*].id
}

output "database-ipv6-egress-route-id" {
  description = "ID of the database IPv6 egress route"
  value       = try(aws_route.database_ipv6_egress[0].id, "")
}

output "private-nat-gateway-route-ids" {
  description = "List of IDs of the private nat gateway route"
  value       = aws_route.private_nat_gateway[*].id
}

output "private-ipv6-egress-route-ids" {
  description = "List of IDs of the ipv6 egress route"
  value       = aws_route.private_ipv6_egress[*].id
}

output "private-route-table-association-ids" {
  description = "List of IDs of the private route table association"
  value       = aws_route_table_association.private[*].id
}

output "database-route-table-association-ids" {
  description = "List of IDs of the database route table association"
  value       = aws_route_table_association.database[*].id
}

output "elasticache-route-table-association-ids" {
  description = "List of IDs of the elasticache route table association"
  value       = aws_route_table_association.elasticache[*].id
}

output "public-route-table-association-ids" {
  description = "List of IDs of the public route table association"
  value       = aws_route_table_association.public[*].id
}

output "dhcp-options-id" {
  description = "The ID of the DHCP options"
  value       = try(aws_vpc_dhcp_options.this[0].id, "")
}

output "nat-ids" {
  description = "List of allocation ID of Elastic IPs created for AWS NAT Gateway"
  value       = aws_eip.nat[*].id
}

output "nat-public-ips" {
  description = "List of public Elastic IPs created for AWS NAT Gateway"
  value       = var.reuse-nat-ips ? var.external-nat-ips : aws_eip.nat[*].public_ip
}

output "natgw-ids" {
  description = "List of NAT Gateway IDs"
  value       = aws_nat_gateway.this[*].id
}

output "igw-id" {
  description = "The ID of the Internet Gateway"
  value       = try(aws_internet_gateway.this[0].id, "")
}

output "igw-arn" {
  description = "The ARN of the Internet Gateway"
  value       = try(aws_internet_gateway.this[0].arn, "")
}

output "egress-only-internet-gateway-id" {
  description = "The ID of the egress only Internet Gateway"
  value       = try(aws_egress_only_internet_gateway.this[0].id, "")
}

output "vgw-id" {
  description = "The ID of the VPN Gateway"
  value       = try(aws_vpn_gateway.this[0].id, aws_vpn_gateway_attachment.this[0].vpn_gateway_id, "")
}

output "vgw-arn" {
  description = "The ARN of the VPN Gateway"
  value       = try(aws_vpn_gateway.this[0].arn, "")
}

output "public-network-acl-id" {
  description = "ID of the public network ACL"
  value       = try(aws_network_acl.public[0].id, "")
}

output "public-network-acl-arn" {
  description = "ARN of the public network ACL"
  value       = try(aws_network_acl.public[0].arn, "")
}

output "private-network-acl-id" {
  description = "ID of the private network ACL"
  value       = try(aws_network_acl.private[0].id, "")
}

output "private-network-acl-arn" {
  description = "ARN of the private network ACL"
  value       = try(aws_network_acl.private[0].arn, "")
}

output "database-network-acl-id" {
  description = "ID of the database network ACL"
  value       = try(aws_network_acl.database[0].id, "")
}

output "database-network-acl-arn" {
  description = "ARN of the database network ACL"
  value       = try(aws_network_acl.database[0].arn, "")
}

output "elasticache-network-acl-id" {
  description = "ID of the elasticache network ACL"
  value       = try(aws_network_acl.elasticache[0].id, "")
}

output "elasticache-network-acl-arn" {
  description = "ARN of the elasticache network ACL"
  value       = try(aws_network_acl.elasticache[0].arn, "")
}

# VPC flow log
output "vpc-flow-log-id" {
  description = "The ID of the Flow Log resource"
  value       = try(aws_flow_log.this[0].id, "")
}

output "vpc-flow-log-destination-arn" {
  description = "The ARN of the destination for VPC Flow Logs"
  value       = local.flow-log-destination-arn
}

output "vpc-flow-log-destination-type" {
  description = "The type of the destination for VPC Flow Logs"
  value       = var.flow-log-destination-type
}

output "vpc-flow-log-cloudwatch-iam-role-arn" {
  description = "The ARN of the IAM role used when pushing logs to Cloudwatch log group"
  value       = local.flow-log-iam-role-arn
}

# Static values (arguments)
output "azs" {
  description = "A list of availability zones specified as argument to this module"
  value       = var.azs
}

output "name" {
  description = "The name of the VPC specified as argument to this module"
  value       = var.name
}
