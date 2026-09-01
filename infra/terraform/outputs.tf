output "website_url" {
  description = "Live site URL once DNS propagates."
  value       = "https://${var.domain_name}"
}

output "cloudfront_domain_name" {
  description = "Distribution domain (dxxxx.cloudfront.net)."
  value       = aws_cloudfront_distribution.this.domain_name
}

# These feed the deploy workflow as repo Variables. If manage_github_actions_config
# = true Terraform already wrote them; otherwise set them under GitHub → Settings →
# Secrets and variables → Actions → Variables.
output "github_actions_config" {
  description = "Repo Variables consumed by deploy-prod.yml."
  value = {
    var_AWS_DEPLOY_ROLE_ARN        = aws_iam_role.github_actions.arn
    var_AWS_REGION                 = var.aws_region
    var_S3_BUCKET                  = aws_s3_bucket.this.id
    var_CLOUDFRONT_DISTRIBUTION_ID = aws_cloudfront_distribution.this.id
  }
}

# Assumed by the gated Infra workflow (.github/workflows/infra.yml) via OIDC.
output "provision_role_arn" {
  description = "ARN of the role the Infra workflow assumes to provision the stack."
  value       = aws_iam_role.github_actions_provision.arn
}

# one() collapses the 0-or-1 element list `count` produces, yielding null when
# monitoring is disabled rather than failing on a [0] index.
output "alerts_topic_arn" {
  description = "SNS topic the CloudFront alarms and the budget publish to. Null when enable_monitoring = false."
  value       = one(aws_sns_topic.alerts[*].arn)
}

output "alerts_subscription_state" {
  description = "Whether alerts will actually reach anyone."
  value = (
    !var.enable_monitoring
    ? "Monitoring disabled — set enable_monitoring = true to create the alarms and budget."
    : var.alert_email == ""
    ? "No alert_email set — topic has no subscriber."
    : "Check ${var.alert_email} for the AWS confirmation link; alerts are not delivered until it is clicked."
  )
}
