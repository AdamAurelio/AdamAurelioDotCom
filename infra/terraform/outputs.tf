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
