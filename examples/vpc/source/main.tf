locals {
  max-subnet-length = max(
    length(var.private-subnets),
    length(var.elasticache-subnets),
    length(var.database-subnets)
  )
  nat-gateway-count = var.single-nat-gateway ? 1 : var.one-nat-gateway-per-az ? length(var.azs) : local.max-subnet-length

  # Use `local.vpc_id` to give a hint to Terraform that subnets should be deleted before secondary CIDR blocks can be free!
  vpc_id = try(aws_vpc_ipv4_cidr_block_association.this[0].vpc_id, aws_vpc.this[0].id, "")
  alpha = [
    "A",
    "B",
    "C"
  ]
}

################################################################################
# VPC
################################################################################

resource "aws_vpc" "this" {
  count = var.create-vpc ? 1 : 0

  cidr_block                       = var.cidr
  instance_tenancy                 = var.instance-tenancy
  enable_dns_hostnames             = var.enable-dns-hostnames
  enable_dns_support               = var.enable-dns-support
  enable_classiclink               = var.enable-classiclink
  enable_classiclink_dns_support   = var.enable-classiclink-dns-support
  assign_generated_ipv6_cidr_block = var.enable-ipv6

  tags = merge(
    { "Name" = var.name },
    var.tags,
    var.vpc-tags,
  )
}

resource "aws_vpc_ipv4_cidr_block_association" "this" {
  count = var.create-vpc && length(var.secondary-cidr-blocks) > 0 ? length(var.secondary-cidr-blocks) : 0

  # Do not turn this into `local.vpc_id`
  vpc_id = aws_vpc.this[0].id

  cidr_block = element(var.secondary-cidr-blocks, count.index)
}

resource "aws_default_security_group" "this" {
  count = var.create-vpc && var.manage-default-security-group ? 1 : 0

  vpc_id = aws_vpc.this[0].id

  dynamic "ingress" {
    for_each = var.default-security-group-ingress
    content {
      self             = lookup(ingress.value, "self", null)
      cidr_blocks      = compact(split(",", lookup(ingress.value, "cidr_blocks", "")))
      ipv6_cidr_blocks = compact(split(",", lookup(ingress.value, "ipv6_cidr_blocks", "")))
      prefix_list_ids  = compact(split(",", lookup(ingress.value, "prefix_list_ids", "")))
      security_groups  = compact(split(",", lookup(ingress.value, "security_groups", "")))
      description      = lookup(ingress.value, "description", null)
      from_port        = lookup(ingress.value, "from_port", 0)
      to_port          = lookup(ingress.value, "to_port", 0)
      protocol         = lookup(ingress.value, "protocol", "-1")
    }
  }

  dynamic "egress" {
    for_each = var.default-security-group-egress
    content {
      self             = lookup(egress.value, "self", null)
      cidr_blocks      = compact(split(",", lookup(egress.value, "cidr_blocks", "")))
      ipv6_cidr_blocks = compact(split(",", lookup(egress.value, "ipv6_cidr_blocks", "")))
      prefix_list_ids  = compact(split(",", lookup(egress.value, "prefix_list_ids", "")))
      security_groups  = compact(split(",", lookup(egress.value, "security_groups", "")))
      description      = lookup(egress.value, "description", null)
      from_port        = lookup(egress.value, "from_port", 0)
      to_port          = lookup(egress.value, "to_port", 0)
      protocol         = lookup(egress.value, "protocol", "-1")
    }
  }

  tags = merge(
    { "Name" = coalesce(var.default-security-group-name, var.name) },
    var.tags,
    var.default-security-group-tags,
  )
}

################################################################################
# DHCP Options Set
################################################################################

resource "aws_vpc_dhcp_options" "this" {
  count = var.create-vpc && var.enable-dhcp-options ? 1 : 0

  domain_name          = var.dhcp-options-domain-name
  domain_name_servers  = var.dhcp-options-domain-name-servers
  ntp_servers          = var.dhcp-options-ntp-servers
  netbios_name_servers = var.dhcp-options-netbios-name-servers
  netbios_node_type    = var.dhcp-options-netbios-node-type

  tags = merge(
    { "Name" = var.name },
    var.tags,
    var.dhcp-options-tags,
  )
}

resource "aws_vpc_dhcp_options_association" "this" {
  count = var.create-vpc && var.enable-dhcp-options ? 1 : 0

  vpc_id          = local.vpc_id
  dhcp_options_id = aws_vpc_dhcp_options.this[0].id
}

################################################################################
# Internet Gateway
################################################################################

resource "aws_internet_gateway" "this" {
  count = var.create-vpc && var.create-igw && length(var.public-subnets) > 0 ? 1 : 0

  vpc_id = local.vpc_id

  tags = merge(
    { "Name" = var.name },
    var.tags,
    var.igw-tags,
  )
}

resource "aws_egress_only_internet_gateway" "this" {
  count = var.create-vpc && var.create-egress-only-igw && var.enable-ipv6 && local.max-subnet-length > 0 ? 1 : 0

  vpc_id = local.vpc_id

  tags = merge(
    { "Name" = var.name },
    var.tags,
    var.igw-tags,
  )
}

################################################################################
# Publiс routes
################################################################################

resource "aws_route_table" "public" {
  count = var.create-vpc && length(var.public-subnets) > 0 ? 1 : 0

  vpc_id = local.vpc_id

  tags = merge(
    /// {
    ///   "Name" = "${var.name}-${var.public-subnet-suffix}"
    /// },
    { "Name" = format("${var.organization}-${var.environment}-Public-Route-Table-%s", length(var.public-subnets) > 0 ? "Primary" : count.index)},
    var.tags,
    var.public-route-table-tags,
  )
}

resource "aws_route" "public_internet_gateway" {
  count = var.create-vpc && var.create-igw && length(var.public-subnets) > 0 ? 1 : 0

  route_table_id         = aws_route_table.public[0].id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.this[0].id

  timeouts {
    create = "5m"
  }
}

resource "aws_route" "public_internet_gateway_ipv6" {
  count = var.create-vpc && var.create-igw && var.enable-ipv6 && length(var.public-subnets) > 0 ? 1 : 0

  route_table_id              = aws_route_table.public[0].id
  destination_ipv6_cidr_block = "::/0"
  gateway_id                  = aws_internet_gateway.this[0].id
}

################################################################################
# Private routes
# There are as many routing tables as the number of NAT gateways
################################################################################

resource "aws_route_table" "private" {
  count = var.create-vpc && local.max-subnet-length > 0 ? local.nat-gateway-count : 0

  vpc_id = local.vpc_id

  tags = merge(
    /// {
    ///   "Name" = var.single-nat-gateway ? "${var.name}-${var.private-subnet-suffix}" : format(
    ///     "${var.name}-${var.private-subnet-suffix}-%s",
    ///     element(var.azs, count.index),
    ///   )
    /// },
    { "Name" = format("${var.organization}-${var.environment}-Private-Route-Table-%s", length(var.public-subnets) > 0 ? "Primary" : count.index)},
    var.tags,
    var.private-route-table-tags,
  )
}

################################################################################
# Database routes
################################################################################

resource "aws_route_table" "database" {
  count = var.create-vpc && var.create-database-subnet-route-table && length(var.database-subnets) > 0 ? var.single-nat-gateway || var.create-database-internet-gateway-route ? 1 : length(var.database-subnets) : 0

  vpc_id = local.vpc_id

  tags = merge(
    /// {
    ///   "Name" = var.single-nat-gateway || var.create-database-internet-gateway-route ? "${var.name}-${var.database-subnet-suffix}" : format(
    ///     "${var.name}-${var.database-subnet-suffix}-%s",
    ///     element(var.azs, count.index),
    ///   )
    /// },
    { "Name" = format("${var.organization}-${var.environment}-Database-Route-Table-%s", length(var.public-subnets) > 0 ? "Primary" : count.index)},
    var.tags,
    var.database-route-table-tags,
  )
}

resource "aws_route" "database_internet_gateway" {
  count = var.create-vpc && var.create-igw && var.create-database-subnet-route-table && length(var.database-subnets) > 0 && var.create-database-internet-gateway-route && false == var.create-database-nat-gateway-route ? 1 : 0

  route_table_id         = aws_route_table.database[0].id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.this[0].id

  timeouts {
    create = "5m"
  }
}

resource "aws_route" "database_nat_gateway" {
  count = var.create-vpc && var.create-database-subnet-route-table && length(var.database-subnets) > 0 && false == var.create-database-internet-gateway-route && var.create-database-nat-gateway-route && var.enable-nat-gateway ? var.single-nat-gateway ? 1 : length(var.database-subnets) : 0

  route_table_id         = element(aws_route_table.database[*].id, count.index)
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = element(aws_nat_gateway.this[*].id, count.index)

  timeouts {
    create = "5m"
  }
}

resource "aws_route" "database_ipv6_egress" {
  count = var.create-vpc && var.create-egress-only-igw && var.enable-ipv6 && var.create-database-subnet-route-table && length(var.database-subnets) > 0 && var.create-database-internet-gateway-route ? 1 : 0

  route_table_id              = aws_route_table.database[0].id
  destination_ipv6_cidr_block = "::/0"
  egress_only_gateway_id      = aws_egress_only_internet_gateway.this[0].id

  timeouts {
    create = "5m"
  }
}

################################################################################
# Elasticache routes
################################################################################

resource "aws_route_table" "elasticache" {
  count = var.create-vpc && var.create-elasticache-subnet-route-table && length(var.elasticache-subnets) > 0 ? 1 : 0

  vpc_id = local.vpc_id

  tags = merge(
    /// { "Name" = "${var.name}-${var.elasticache-subnet-suffix}" },
    { "Name" = format("${var.organization}-${var.environment}-Elasticache-Route-Table-%s", length(var.public-subnets) > 0 ? "Primary" : count.index)},
    var.tags,
    var.elasticache-route-table-tags,
  )
}

################################################################################
# Public subnet
################################################################################

resource "aws_subnet" "public" {
  count = var.create-vpc && length(var.public-subnets) > 0 && (false == var.one-nat-gateway-per-az || length(var.public-subnets) >= length(var.azs)) ? length(var.public-subnets) : 0

  vpc_id                          = local.vpc_id
  cidr_block                      = element(concat(var.public-subnets, [""]), count.index)
  availability_zone               = length(regexall("^[a-z]{2}-", element(var.azs, count.index))) > 0 ? element(var.azs, count.index) : null
  availability_zone_id            = length(regexall("^[a-z]{2}-", element(var.azs, count.index))) == 0 ? element(var.azs, count.index) : null
  map_public_ip_on_launch         = var.map-public-ip-on-launch
  assign_ipv6_address_on_creation = var.public-subnet-assign-ipv6-address-on-creation == null ? var.assign-ipv6-address-on-creation : var.public-subnet-assign-ipv6-address-on-creation

  ipv6_cidr_block = var.enable-ipv6 && length(var.public-subnet-ipv6-prefixes) > 0 ? cidrsubnet(aws_vpc.this[0].ipv6_cidr_block, 8, var.public-subnet-ipv6-prefixes[count.index]) : null

  tags = merge(
    {
      "Name" = format(
        "${var.organization}-${var.environment}-Subnet-${var.public-subnet-suffix}-%s",
        "${count.index + 1}${element(local.alpha, count.index)}"
      )
    },
    var.tags,
    var.database-subnet-tags,
  )
}

################################################################################
# Private subnet
################################################################################

resource "aws_subnet" "private" {
  count = var.create-vpc && length(var.private-subnets) > 0 ? length(var.private-subnets) : 0

  vpc_id                          = local.vpc_id
  cidr_block                      = var.private-subnets[count.index]
  availability_zone               = length(regexall("^[a-z]{2}-", element(var.azs, count.index))) > 0 ? element(var.azs, count.index) : null
  availability_zone_id            = length(regexall("^[a-z]{2}-", element(var.azs, count.index))) == 0 ? element(var.azs, count.index) : null
  assign_ipv6_address_on_creation = var.private-subnet-assign-ipv6-address-on-creation == null ? var.assign-ipv6-address-on-creation : var.private-subnet-assign-ipv6-address-on-creation

  ipv6_cidr_block = var.enable-ipv6 && length(var.private-subnet-ipv6-prefixes) > 0 ? cidrsubnet(aws_vpc.this[0].ipv6_cidr_block, 8, var.private-subnet-ipv6-prefixes[count.index]) : null

  tags = merge(
    {
      "Name" = format(
        "${var.organization}-${var.environment}-Subnet-${var.private-subnet-suffix}-%s",
        "${count.index + 1}${element(local.alpha, count.index)}"
      )
    },
    var.tags,
    var.database-subnet-tags,
  )
}

################################################################################
# Database subnet
################################################################################

resource "aws_subnet" "database" {
  count = var.create-vpc && length(var.database-subnets) > 0 ? length(var.database-subnets) : 0

  vpc_id                          = local.vpc_id
  cidr_block                      = var.database-subnets[count.index]
  availability_zone               = length(regexall("^[a-z]{2}-", element(var.azs, count.index))) > 0 ? element(var.azs, count.index) : null
  availability_zone_id            = length(regexall("^[a-z]{2}-", element(var.azs, count.index))) == 0 ? element(var.azs, count.index) : null
  assign_ipv6_address_on_creation = var.database-subnet-assign-ipv6-address-on-creation == null ? var.assign-ipv6-address-on-creation : var.database-subnet-assign-ipv6-address-on-creation

  ipv6_cidr_block = var.enable-ipv6 && length(var.database-subnet-ipv6-prefixes) > 0 ? cidrsubnet(aws_vpc.this[0].ipv6_cidr_block, 8, var.database-subnet-ipv6-prefixes[count.index]) : null

  tags = merge(
    {
      "Name" = format(
        "${var.organization}-${var.environment}-Subnet-${var.database-subnet-suffix}-%s",
        "${count.index + 1}${element(local.alpha, count.index)}"
      )
    },
    var.tags,
    var.database-subnet-tags,
  )
}

resource "aws_db_subnet_group" "database" {
  count = var.create-vpc && length(var.database-subnets) > 0 && var.create-database-subnet-group ? 1 : 0

  name        = lower(coalesce(var.database-subnet-group-name, var.name))
  description = "Database subnet group for ${var.name}"
  subnet_ids  = aws_subnet.database[*].id

  tags = merge(
    {
      "Name" = lower(coalesce(var.database-subnet-group-name, var.name))
    },
    var.tags,
    var.database-subnet-group-tags,
  )
}

################################################################################
# ElastiCache subnet
################################################################################

resource "aws_subnet" "elasticache" {
  count = var.create-vpc && length(var.elasticache-subnets) > 0 ? length(var.elasticache-subnets) : 0

  vpc_id                          = local.vpc_id
  cidr_block                      = var.elasticache-subnets[count.index]
  availability_zone               = length(regexall("^[a-z]{2}-", element(var.azs, count.index))) > 0 ? element(var.azs, count.index) : null
  availability_zone_id            = length(regexall("^[a-z]{2}-", element(var.azs, count.index))) == 0 ? element(var.azs, count.index) : null
  assign_ipv6_address_on_creation = var.elasticache-subnet-assign-ipv6-address-on-creation == null ? var.assign-ipv6-address-on-creation : var.elasticache-subnet-assign-ipv6-address-on-creation

  ipv6_cidr_block = var.enable-ipv6 && length(var.elasticache-subnet-ipv6-prefixes) > 0 ? cidrsubnet(aws_vpc.this[0].ipv6_cidr_block, 8, var.elasticache-subnet-ipv6-prefixes[count.index]) : null

  tags = merge(
    {
      "Name" = format(
        "${var.organization}-${var.environment}-Subnet-${var.elasticache-subnet-suffix}-%s",
        "${count.index + 1}${element(local.alpha, count.index)}"
      )
    },
    var.tags,
    var.database-subnet-tags,
  )
}

resource "aws_elasticache_subnet_group" "elasticache" {
  count = var.create-vpc && length(var.elasticache-subnets) > 0 && var.create-elasticache-subnet-group ? 1 : 0

  name        = coalesce(var.elasticache-subnet-group-name, var.name)
  description = "ElastiCache subnet group for ${var.name}"
  subnet_ids  = aws_subnet.elasticache[*].id

  tags = merge(
    { "Name" = coalesce(var.elasticache-subnet-group-name, var.name) },
    var.tags,
    var.elasticache-subnet-group-tags,
  )
}

################################################################################
# Public Network ACLs
################################################################################

resource "aws_network_acl" "public" {
  count = var.create-vpc && var.public-dedicated-network-acl && length(var.public-subnets) > 0 ? 1 : 0

  vpc_id     = local.vpc_id
  subnet_ids = aws_subnet.public[*].id

  tags = merge(
    /// { "Name" = "${var.name}-${var.public-subnet-suffix}" },
    { "Name" = format("${var.organization}-${var.environment}-Public-ACL")},
    var.tags,
    var.public-acl-tags,
  )
}

resource "aws_network_acl_rule" "public_inbound" {
  count = var.create-vpc && var.public-dedicated-network-acl && length(var.public-subnets) > 0 ? length(var.public-inbound-acl-rules) : 0

  network_acl_id = aws_network_acl.public[0].id

  egress          = false
  rule_number     = var.public-inbound-acl-rules[count.index]["rule_number"]
  rule_action     = var.public-inbound-acl-rules[count.index]["rule_action"]
  from_port       = lookup(var.public-inbound-acl-rules[count.index], "from_port", null)
  to_port         = lookup(var.public-inbound-acl-rules[count.index], "to_port", null)
  icmp_code       = lookup(var.public-inbound-acl-rules[count.index], "icmp_code", null)
  icmp_type       = lookup(var.public-inbound-acl-rules[count.index], "icmp_type", null)
  protocol        = var.public-inbound-acl-rules[count.index]["protocol"]
  cidr_block      = lookup(var.public-inbound-acl-rules[count.index], "cidr_block", null)
  ipv6_cidr_block = lookup(var.public-inbound-acl-rules[count.index], "ipv6_cidr_block", null)
}

resource "aws_network_acl_rule" "public_outbound" {
  count = var.create-vpc && var.public-dedicated-network-acl && length(var.public-subnets) > 0 ? length(var.public-outbound-acl-rules) : 0

  network_acl_id = aws_network_acl.public[0].id

  egress          = true
  rule_number     = var.public-outbound-acl-rules[count.index]["rule_number"]
  rule_action     = var.public-outbound-acl-rules[count.index]["rule_action"]
  from_port       = lookup(var.public-outbound-acl-rules[count.index], "from_port", null)
  to_port         = lookup(var.public-outbound-acl-rules[count.index], "to_port", null)
  icmp_code       = lookup(var.public-outbound-acl-rules[count.index], "icmp_code", null)
  icmp_type       = lookup(var.public-outbound-acl-rules[count.index], "icmp_type", null)
  protocol        = var.public-outbound-acl-rules[count.index]["protocol"]
  cidr_block      = lookup(var.public-outbound-acl-rules[count.index], "cidr_block", null)
  ipv6_cidr_block = lookup(var.public-outbound-acl-rules[count.index], "ipv6_cidr_block", null)
}

################################################################################
# Private Network ACLs
################################################################################

resource "aws_network_acl" "private" {
  count = var.create-vpc && var.private-dedicated-network-acl && length(var.private-subnets) > 0 ? 1 : 0

  vpc_id     = local.vpc_id
  subnet_ids = aws_subnet.private[*].id

  tags = merge(
    /// { "Name" = "${var.name}-${var.private-subnet-suffix}" },
    { "Name" = format("${var.organization}-${var.environment}-Private-ACL")},
    var.tags,
    var.private-acl-tags,
  )
}

resource "aws_network_acl_rule" "private_inbound" {
  count = var.create-vpc && var.private-dedicated-network-acl && length(var.private-subnets) > 0 ? length(var.private-inbound-acl-rules) : 0

  network_acl_id = aws_network_acl.private[0].id

  egress          = false
  rule_number     = var.private-inbound-acl-rules[count.index]["rule_number"]
  rule_action     = var.private-inbound-acl-rules[count.index]["rule_action"]
  from_port       = lookup(var.private-inbound-acl-rules[count.index], "from_port", null)
  to_port         = lookup(var.private-inbound-acl-rules[count.index], "to_port", null)
  icmp_code       = lookup(var.private-inbound-acl-rules[count.index], "icmp_code", null)
  icmp_type       = lookup(var.private-inbound-acl-rules[count.index], "icmp_type", null)
  protocol        = var.private-inbound-acl-rules[count.index]["protocol"]
  cidr_block      = lookup(var.private-inbound-acl-rules[count.index], "cidr_block", null)
  ipv6_cidr_block = lookup(var.private-inbound-acl-rules[count.index], "ipv6_cidr_block", null)
}

resource "aws_network_acl_rule" "private_outbound" {
  count = var.create-vpc && var.private-dedicated-network-acl && length(var.private-subnets) > 0 ? length(var.private-outbound-acl-rules) : 0

  network_acl_id = aws_network_acl.private[0].id

  egress          = true
  rule_number     = var.private-outbound-acl-rules[count.index]["rule_number"]
  rule_action     = var.private-outbound-acl-rules[count.index]["rule_action"]
  from_port       = lookup(var.private-outbound-acl-rules[count.index], "from_port", null)
  to_port         = lookup(var.private-outbound-acl-rules[count.index], "to_port", null)
  icmp_code       = lookup(var.private-outbound-acl-rules[count.index], "icmp_code", null)
  icmp_type       = lookup(var.private-outbound-acl-rules[count.index], "icmp_type", null)
  protocol        = var.private-outbound-acl-rules[count.index]["protocol"]
  cidr_block      = lookup(var.private-outbound-acl-rules[count.index], "cidr_block", null)
  ipv6_cidr_block = lookup(var.private-outbound-acl-rules[count.index], "ipv6_cidr_block", null)
}

################################################################################
# Database Network ACLs
################################################################################

resource "aws_network_acl" "database" {
  count = var.create-vpc && var.database-dedicated-network-acl && length(var.database-subnets) > 0 ? 1 : 0

  vpc_id     = local.vpc_id
  subnet_ids = aws_subnet.database[*].id

  tags = merge(
    /// { "Name" = "${var.name}-${var.database-subnet-suffix}" },
    { "Name" = format("${var.organization}-${var.environment}-Database-ACL")},
    var.tags,
    var.database-acl-tags,
  )
}

resource "aws_network_acl_rule" "database_inbound" {
  count = var.create-vpc && var.database-dedicated-network-acl && length(var.database-subnets) > 0 ? length(var.database-inbound-acl-rules) : 0

  network_acl_id = aws_network_acl.database[0].id

  egress          = false
  rule_number     = var.database-inbound-acl-rules[count.index]["rule_number"]
  rule_action     = var.database-inbound-acl-rules[count.index]["rule_action"]
  from_port       = lookup(var.database-inbound-acl-rules[count.index], "from_port", null)
  to_port         = lookup(var.database-inbound-acl-rules[count.index], "to_port", null)
  icmp_code       = lookup(var.database-inbound-acl-rules[count.index], "icmp_code", null)
  icmp_type       = lookup(var.database-inbound-acl-rules[count.index], "icmp_type", null)
  protocol        = var.database-inbound-acl-rules[count.index]["protocol"]
  cidr_block      = lookup(var.database-inbound-acl-rules[count.index], "cidr_block", null)
  ipv6_cidr_block = lookup(var.database-inbound-acl-rules[count.index], "ipv6_cidr_block", null)
}

resource "aws_network_acl_rule" "database_outbound" {
  count = var.create-vpc && var.database-dedicated-network-acl && length(var.database-subnets) > 0 ? length(var.database-outbound-acl-rules) : 0

  network_acl_id = aws_network_acl.database[0].id

  egress          = true
  rule_number     = var.database-outbound-acl-rules[count.index]["rule_number"]
  rule_action     = var.database-outbound-acl-rules[count.index]["rule_action"]
  from_port       = lookup(var.database-outbound-acl-rules[count.index], "from_port", null)
  to_port         = lookup(var.database-outbound-acl-rules[count.index], "to_port", null)
  icmp_code       = lookup(var.database-outbound-acl-rules[count.index], "icmp_code", null)
  icmp_type       = lookup(var.database-outbound-acl-rules[count.index], "icmp_type", null)
  protocol        = var.database-outbound-acl-rules[count.index]["protocol"]
  cidr_block      = lookup(var.database-outbound-acl-rules[count.index], "cidr_block", null)
  ipv6_cidr_block = lookup(var.database-outbound-acl-rules[count.index], "ipv6_cidr_block", null)
}

################################################################################
# Elasticache Network ACLs
################################################################################

resource "aws_network_acl" "elasticache" {
  count = var.create-vpc && var.elasticache-dedicated-network-acl && length(var.elasticache-subnets) > 0 ? 1 : 0

  vpc_id     = local.vpc_id
  subnet_ids = aws_subnet.elasticache[*].id

  tags = merge(
    /// { "Name" = "${var.name}-${var.elasticache-subnet-suffix}" },
    { "Name" = format("${var.organization}-${var.environment}-Elasticache-ACL")},
    var.tags,
    var.elasticache-acl-tags,
  )
}

resource "aws_network_acl_rule" "elasticache_inbound" {
  count = var.create-vpc && var.elasticache-dedicated-network-acl && length(var.elasticache-subnets) > 0 ? length(var.elasticache-inbound-acl-rules) : 0

  network_acl_id = aws_network_acl.elasticache[0].id

  egress          = false
  rule_number     = var.elasticache-inbound-acl-rules[count.index]["rule_number"]
  rule_action     = var.elasticache-inbound-acl-rules[count.index]["rule_action"]
  from_port       = lookup(var.elasticache-inbound-acl-rules[count.index], "from_port", null)
  to_port         = lookup(var.elasticache-inbound-acl-rules[count.index], "to_port", null)
  icmp_code       = lookup(var.elasticache-inbound-acl-rules[count.index], "icmp_code", null)
  icmp_type       = lookup(var.elasticache-inbound-acl-rules[count.index], "icmp_type", null)
  protocol        = var.elasticache-inbound-acl-rules[count.index]["protocol"]
  cidr_block      = lookup(var.elasticache-inbound-acl-rules[count.index], "cidr_block", null)
  ipv6_cidr_block = lookup(var.elasticache-inbound-acl-rules[count.index], "ipv6_cidr_block", null)
}

resource "aws_network_acl_rule" "elasticache_outbound" {
  count = var.create-vpc && var.elasticache-dedicated-network-acl && length(var.elasticache-subnets) > 0 ? length(var.elasticache-outbound-acl-rules) : 0

  network_acl_id = aws_network_acl.elasticache[0].id

  egress          = true
  rule_number     = var.elasticache-outbound-acl-rules[count.index]["rule_number"]
  rule_action     = var.elasticache-outbound-acl-rules[count.index]["rule_action"]
  from_port       = lookup(var.elasticache-outbound-acl-rules[count.index], "from_port", null)
  to_port         = lookup(var.elasticache-outbound-acl-rules[count.index], "to_port", null)
  icmp_code       = lookup(var.elasticache-outbound-acl-rules[count.index], "icmp_code", null)
  icmp_type       = lookup(var.elasticache-outbound-acl-rules[count.index], "icmp_type", null)
  protocol        = var.elasticache-outbound-acl-rules[count.index]["protocol"]
  cidr_block      = lookup(var.elasticache-outbound-acl-rules[count.index], "cidr_block", null)
  ipv6_cidr_block = lookup(var.elasticache-outbound-acl-rules[count.index], "ipv6_cidr_block", null)
}

################################################################################
# NAT Gateway
################################################################################

locals {
  nat_gateway_ips = var.reuse-nat-ips ? var.external-nat-ip-ids : try(aws_eip.nat[*].id, [])
}

resource "aws_eip" "nat" {
  count = var.create-vpc && var.enable-nat-gateway && false == var.reuse-nat-ips ? local.nat-gateway-count : 0

  vpc = true

  tags = merge(
    /// {
    ///   "Name" = format(
    ///     "${var.name}-%s",
    ///     element(var.azs, var.single-nat-gateway ? 0 : count.index),
    ///   )
    /// },
    { "Name" = format("${var.organization}-${var.environment}-NAT-%s-EIP", var.single-nat-gateway ? "Primary" : count.index)},
    var.tags,
    var.nat-eip-tags,
  )
}

resource "aws_nat_gateway" "this" {
  count = var.create-vpc && var.enable-nat-gateway ? local.nat-gateway-count : 0

  allocation_id = element(
    local.nat_gateway_ips,
    var.single-nat-gateway ? 0 : count.index,
  )
  subnet_id = element(
    aws_subnet.public[*].id,
    var.single-nat-gateway ? 0 : count.index,
  )

  tags = merge(
    { "Name" = format("${var.organization}-${var.environment}-VPN-Gateway-%s-%s", var.single-nat-gateway ? "Primary" : count.index, "NAT")},
    /// {
    ///   "Name" = format(
    ///     "${var.name}-%s",
    ///     element(var.azs, var.single-nat-gateway ? 0 : count.index),
    ///   )
    /// },
    var.tags,
    var.nat-gateway-tags,
  )

  depends_on = [aws_internet_gateway.this]
}

resource "aws_route" "private_nat_gateway" {
  count = var.create-vpc && var.enable-nat-gateway ? local.nat-gateway-count : 0

  route_table_id         = element(aws_route_table.private[*].id, count.index)
  destination_cidr_block = var.nat-gateway-destination-cidr-block
  nat_gateway_id         = element(aws_nat_gateway.this[*].id, count.index)

  timeouts {
    create = "5m"
  }
}

resource "aws_route" "private_ipv6_egress" {
  count = var.create-vpc && var.create-egress-only-igw && var.enable-ipv6 ? length(var.private-subnets) : 0

  route_table_id              = element(aws_route_table.private[*].id, count.index)
  destination_ipv6_cidr_block = "::/0"
  egress_only_gateway_id      = element(aws_egress_only_internet_gateway.this[*].id, 0)
}

################################################################################
# Route table association
################################################################################

resource "aws_route_table_association" "private" {
  count = var.create-vpc && length(var.private-subnets) > 0 ? length(var.private-subnets) : 0

  subnet_id = element(aws_subnet.private[*].id, count.index)
  route_table_id = element(
    aws_route_table.private[*].id,
    var.single-nat-gateway ? 0 : count.index,
  )
}

resource "aws_route_table_association" "database" {
  count = var.create-vpc && length(var.database-subnets) > 0 ? length(var.database-subnets) : 0

  subnet_id = element(aws_subnet.database[*].id, count.index)
  route_table_id = element(
    coalescelist(aws_route_table.database[*].id, aws_route_table.private[*].id),
    var.create-database-subnet-route-table ? var.single-nat-gateway || var.create-database-internet-gateway-route ? 0 : count.index : count.index,
  )
}

resource "aws_route_table_association" "elasticache" {
  count = var.create-vpc && length(var.elasticache-subnets) > 0 ? length(var.elasticache-subnets) : 0

  subnet_id = element(aws_subnet.elasticache[*].id, count.index)
  route_table_id = element(
    coalescelist(
      aws_route_table.elasticache[*].id,
      aws_route_table.private[*].id,
    ),
    var.single-nat-gateway || var.create-elasticache-subnet-route-table ? 0 : count.index,
  )
}

resource "aws_route_table_association" "public" {
  count = var.create-vpc && length(var.public-subnets) > 0 ? length(var.public-subnets) : 0

  subnet_id      = element(aws_subnet.public[*].id, count.index)
  route_table_id = aws_route_table.public[0].id
}

################################################################################
# VPN Gateway
################################################################################

resource "aws_vpn_gateway" "this" {
  count = var.create-vpc && var.enable-vpn-gateway ? 1 : 0

  vpc_id            = local.vpc_id
  amazon_side_asn   = var.amazon-side-asn
  availability_zone = var.vpn-gateway-az

  tags = merge(
    { "Name" = "${var.organization}-${var.environment}-VPN-Gateway", },
    var.tags,
    var.vpn-gateway-tags,
  )
}

resource "aws_vpn_gateway_attachment" "this" {
  count = var.vpn-gateway-id != "" ? 1 : 0

  vpc_id         = local.vpc_id
  vpn_gateway_id = var.vpn-gateway-id
}

resource "aws_vpn_gateway_route_propagation" "public" {
  count = var.create-vpc && var.propagate-public-route-tables-vgw && (var.enable-vpn-gateway || var.vpn-gateway-id != "") ? 1 : 0

  route_table_id = element(aws_route_table.public[*].id, count.index)
  vpn_gateway_id = element(
    concat(
      aws_vpn_gateway.this[*].id,
      aws_vpn_gateway_attachment.this[*].vpn_gateway_id,
    ),
    count.index,
  )
}

resource "aws_vpn_gateway_route_propagation" "private" {
  count = var.create-vpc && var.propagate-private-route-tables-vgw && (var.enable-vpn-gateway || var.vpn-gateway-id != "") ? length(var.private-subnets) : 0

  route_table_id = element(aws_route_table.private[*].id, count.index)
  vpn_gateway_id = element(
    concat(
      aws_vpn_gateway.this[*].id,
      aws_vpn_gateway_attachment.this[*].vpn_gateway_id,
    ),
    count.index,
  )
}
