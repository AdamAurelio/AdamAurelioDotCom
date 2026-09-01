# ── Alerting ─────────────────────────────────────────────────────────────────
# There is no server to watch, so monitoring here is deliberately narrow: tell
# me when the edge starts erroring, and tell me before the bill surprises me.
# Uptime checks are intentionally absent — S3 + CloudFront failing wholesale is
# an AWS-wide event I'd hear about anyway, and a synthetic check costs more than
# it would ever catch on a static site.
#
# Everything lives in us-east-1: CloudFront publishes its metrics there
# regardless of the bucket's region, and AWS Budgets only notifies SNS topics in
# us-east-1. Using the aliased provider keeps that true even if var.aws_region
# changes later.

# Off by default. Everything below is gated on var.enable_monitoring so the
# stack can be adopted later without re-deriving it — flip the flag in
# terraform.tfvars and apply. Nothing here bills on a site this size: the first
# two AWS Budgets are free, the two alarms sit inside CloudWatch's 10-alarm free
# tier, and SNS covers 1,000 email notifications a month.
locals {
  monitoring_count = var.enable_monitoring ? 1 : 0
}

data "aws_caller_identity" "current" {}

resource "aws_sns_topic" "alerts" {
  provider = aws.us_east_1
  count    = local.monitoring_count
  name     = "adamaurelio-alerts"
}

# CloudWatch and Budgets are separate principals and neither can publish to a
# topic by default — without this policy the alarms flip to ALARM and silently
# fail to notify.
data "aws_iam_policy_document" "alerts_topic" {
  count = local.monitoring_count

  statement {
    sid       = "AllowCloudWatchAndBudgetsPublish"
    effect    = "Allow"
    actions   = ["SNS:Publish"]
    resources = [aws_sns_topic.alerts[0].arn]

    principals {
      type        = "Service"
      identifiers = ["cloudwatch.amazonaws.com", "budgets.amazonaws.com"]
    }

    # Scope to this account so another tenant's alarm can't publish here.
    condition {
      test     = "StringEquals"
      variable = "AWS:SourceAccount"
      values   = [data.aws_caller_identity.current.account_id]
    }
  }
}

resource "aws_sns_topic_policy" "alerts" {
  provider = aws.us_east_1
  count    = local.monitoring_count
  arn      = aws_sns_topic.alerts[0].arn
  policy   = data.aws_iam_policy_document.alerts_topic[0].json
}

# Email subscription is optional so `terraform apply` still works before an
# address is chosen. AWS sends a confirmation link — the subscription stays
# "PendingConfirmation", and silent, until that link is clicked.
resource "aws_sns_topic_subscription" "alerts_email" {
  provider  = aws.us_east_1
  count     = var.enable_monitoring && var.alert_email != "" ? 1 : 0
  topic_arn = aws_sns_topic.alerts[0].arn
  protocol  = "email"
  endpoint  = var.alert_email
}

# ── CloudFront error alarms ──────────────────────────────────────────────────
# `Region = "Global"` is required: CloudFront's account-level metrics are only
# published under that dimension value.
#
# treat_missing_data = "notBreaching" matters on a low-traffic site. With no
# visitors there is no datapoint, and the default ("missing") would leave the
# alarm stuck in INSUFFICIENT_DATA rather than OK.

resource "aws_cloudwatch_metric_alarm" "cloudfront_5xx" {
  provider = aws.us_east_1
  count    = local.monitoring_count

  alarm_name        = "adamaurelio-cloudfront-5xx"
  alarm_description = "CloudFront is returning server errors for ${var.domain_name}. Usually an S3 origin or OAC permissions problem."

  namespace   = "AWS/CloudFront"
  metric_name = "5xxErrorRate"
  statistic   = "Average"
  period      = 300
  unit        = "Percent"

  comparison_operator = "GreaterThanThreshold"
  threshold           = var.cloudfront_5xx_threshold_percent
  evaluation_periods  = 2
  treat_missing_data  = "notBreaching"

  dimensions = {
    DistributionId = aws_cloudfront_distribution.this.id
    Region         = "Global"
  }

  alarm_actions = [aws_sns_topic.alerts[0].arn]
  ok_actions    = [aws_sns_topic.alerts[0].arn]
}

# 4xx is a softer signal — scanners and stale links produce a steady background
# rate — so the threshold is much higher and this is really here to catch a
# broken deploy (e.g. assets 404ing after a bad sync).
resource "aws_cloudwatch_metric_alarm" "cloudfront_4xx" {
  provider = aws.us_east_1
  count    = local.monitoring_count

  alarm_name        = "adamaurelio-cloudfront-4xx"
  alarm_description = "Sustained client-error rate for ${var.domain_name}. Often a broken deploy leaving assets missing."

  namespace   = "AWS/CloudFront"
  metric_name = "4xxErrorRate"
  statistic   = "Average"
  period      = 300
  unit        = "Percent"

  comparison_operator = "GreaterThanThreshold"
  threshold           = var.cloudfront_4xx_threshold_percent
  evaluation_periods  = 3
  treat_missing_data  = "notBreaching"

  dimensions = {
    DistributionId = aws_cloudfront_distribution.this.id
    Region         = "Global"
  }

  alarm_actions = [aws_sns_topic.alerts[0].arn]
  ok_actions    = [aws_sns_topic.alerts[0].arn]
}

# ── Cost guardrail ───────────────────────────────────────────────────────────
# The stack should cost a couple of dollars a month. This exists to catch the
# failure mode that actually happens to static sites: something starts pulling
# traffic (or a bucket gets scraped in a loop) and the bill moves before anyone
# notices. ACTUAL at 80% is the warning; FORECASTED at 100% is the early one.
resource "aws_budgets_budget" "monthly" {
  provider = aws.us_east_1
  count    = local.monitoring_count

  name         = "adamaurelio-monthly"
  budget_type  = "COST"
  limit_amount = var.monthly_budget_usd
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  notification {
    comparison_operator       = "GREATER_THAN"
    threshold                 = 80
    threshold_type            = "PERCENTAGE"
    notification_type         = "ACTUAL"
    subscriber_sns_topic_arns = [aws_sns_topic.alerts[0].arn]
  }

  notification {
    comparison_operator       = "GREATER_THAN"
    threshold                 = 100
    threshold_type            = "PERCENTAGE"
    notification_type         = "FORECASTED"
    subscriber_sns_topic_arns = [aws_sns_topic.alerts[0].arn]
  }
}
