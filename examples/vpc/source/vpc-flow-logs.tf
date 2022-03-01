locals {
  # Only create flow log if user selected to create a VPC as well
  enable-flow-log = var.create-vpc && var.enable-flow-log

  create-flow-log-cloudwatch-iam-role  = local.enable-flow-log && var.flow-log-destination-type != "s3" && var.create-flow-log-cloudwatch-iam-role
  create-flow-log-cloudwatch-log-group = local.enable-flow-log && var.flow-log-destination-type != "s3" && var.create-flow-log-cloudwatch-log-group

  flow-log-destination-arn = local.create-flow-log-cloudwatch-log-group ? aws_cloudwatch_log_group.flow-log[0].arn : var.flow-log-destination-arn
  flow-log-iam-role-arn    = var.flow-log-destination-type != "s3" && local.create-flow-log-cloudwatch-iam-role ? aws_iam_role.vpc-flow-log-cloudwatch[0].arn : var.flow-log-cloudwatch-iam-role-arn
}

################################################################################
# Flow Log
################################################################################

resource "aws_flow_log" "this" {
  count = local.enable-flow-log ? 1 : 0

  log_destination_type     = var.flow-log-destination-type
  log_destination          = local.flow-log-destination-arn
  log_format               = var.flow-log-log-format
  iam_role_arn             = local.flow-log-iam-role-arn
  traffic_type             = var.flow-log-traffic-type
  vpc_id                   = local.vpc_id
  max_aggregation_interval = var.flow-log-max-aggregation-interval

  dynamic "destination_options" {
    for_each = var.flow-log-destination-type == "s3" ? [true] : []

    content {
      file_format                = var.flow-log-file-format
      hive_compatible_partitions = var.flow-log-hive-compatible-partitions
      per_hour_partition         = var.flow-log-per-hour-partition
    }
  }

  tags = merge(var.tags, var.vpc-flow-log-tags)
}

################################################################################
# Flow Log CloudWatch
################################################################################

resource "aws_cloudwatch_log_group" "flow-log" {
  count = local.create-flow-log-cloudwatch-log-group ? 1 : 0

  name = "${var.organization}-${var.environment}-VPC-Flow-Log"
  retention_in_days = var.flow-log-cloudwatch-log-group-retention-in-days
  kms_key_id        = var.flow-log-cloudwatch-log-group-kms-key-id

  tags = merge(
    var.tags,
    var.vpc-flow-log-tags,
    {
      VPC-ID = local.vpc_id
    }
  )
}

resource "aws_iam_role" "vpc-flow-log-cloudwatch" {
  count = local.create-flow-log-cloudwatch-iam-role ? 1 : 0

  name = "${var.organization}-${var.environment}-VPC-Flow-Log-IAM-Role"
  assume_role_policy   = data.aws_iam_policy_document.flow-log-cloudwatch-assume-role[0].json
  permissions_boundary = var.vpc-flow-log-permissions-boundary

  tags = merge(
    var.tags,
    var.vpc-flow-log-tags,
    {
      VPC-ID = local.vpc_id
    }
  )
}

data "aws_iam_policy_document" "flow-log-cloudwatch-assume-role" {
  count = local.create-flow-log-cloudwatch-iam-role ? 1 : 0

  statement {
    sid = "AWSVPCFlowLogsAssumeRole"

    principals {
      type        = "Service"
      identifiers = ["vpc-flow-logs.amazonaws.com"]
    }

    effect = "Allow"

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role_policy_attachment" "vpc-flow-log-cloudwatch" {
  count = local.create-flow-log-cloudwatch-iam-role ? 1 : 0

  role       = aws_iam_role.vpc-flow-log-cloudwatch[0].name
  policy_arn = aws_iam_policy.vpc-flow-log-cloudwatch[0].arn
}

resource "aws_iam_policy" "vpc-flow-log-cloudwatch" {
  count = local.create-flow-log-cloudwatch-iam-role ? 1 : 0

  name = "${var.organization}-${var.environment}-VPC-Flow-Log-IAM-Policy"
  policy      = data.aws_iam_policy_document.vpc-flow-log-cloudwatch[0].json
  tags        = merge(
    var.tags,
    var.vpc-flow-log-tags,
    {
      VPC-ID = local.vpc_id
    }
  )
}

data "aws_iam_policy_document" "vpc-flow-log-cloudwatch" {
  count = local.create-flow-log-cloudwatch-iam-role ? 1 : 0

  statement {
    sid = "AWSVPCFlowLogsPushToCloudWatch"

    effect = "Allow"

    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "logs:DescribeLogGroups",
      "logs:DescribeLogStreams",
    ]

    resources = ["*"]
  }
}
