# Optional: push the deploy workflow's config into the repo so even the
# "GitHub configuration" step is automated. Enable with
# manage_github_actions_config = true and a GITHUB_TOKEN (repo scope) in the env.
locals {
  github_repo_name = split("/", var.github_repo)[1]
}

resource "github_actions_secret" "aws_role_arn" {
  count           = var.manage_github_actions_config ? 1 : 0
  repository      = local.github_repo_name
  secret_name     = "AWS_ROLE_ARN"
  plaintext_value = aws_iam_role.github_actions.arn
}

resource "github_actions_variable" "aws_region" {
  count         = var.manage_github_actions_config ? 1 : 0
  repository    = local.github_repo_name
  variable_name = "AWS_REGION"
  value         = var.aws_region
}

resource "github_actions_variable" "s3_bucket" {
  count         = var.manage_github_actions_config ? 1 : 0
  repository    = local.github_repo_name
  variable_name = "S3_BUCKET"
  value         = aws_s3_bucket.this.id
}

resource "github_actions_variable" "cloudfront_distribution_id" {
  count         = var.manage_github_actions_config ? 1 : 0
  repository    = local.github_repo_name
  variable_name = "CLOUDFRONT_DISTRIBUTION_ID"
  value         = aws_cloudfront_distribution.this.id
}
