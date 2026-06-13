output "website_url" {
  description = "Live site URL once DNS propagates."
  value       = "https://${var.domain_name}"
}

output "cloudfront_domain_name" {
  description = "Distribution domain (dxxxx.cloudfront.net)."
  value       = aws_cloudfront_distribution.this.domain_name
}

# These three feed the deploy workflow. If manage_github_actions_config = true
# Terraform already wrote them; otherwise copy them into the repo's Actions config.
output "github_actions_config" {
  description = "Values for GitHub → Settings → Secrets and variables → Actions."
  value = {
    secret_AWS_ROLE_ARN            = aws_iam_role.github_actions.arn
    var_AWS_REGION                 = var.aws_region
    var_S3_BUCKET                  = aws_s3_bucket.this.id
    var_CLOUDFRONT_DISTRIBUTION_ID = aws_cloudfront_distribution.this.id
  }
}
