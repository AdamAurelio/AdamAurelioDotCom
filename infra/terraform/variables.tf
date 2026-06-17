variable "domain_name" {
  description = "Apex domain. www.<domain> is added automatically as an alias/SAN."
  type        = string
  default     = "adamaurelio.com"
}

variable "bucket_name" {
  description = "S3 bucket that holds the built site (stays private; CloudFront reads it via OAC)."
  type        = string
  default     = "adamaurelio-com-prod"
}

variable "aws_region" {
  description = "Region for the S3 bucket (and the AWS_REGION GitHub variable)."
  type        = string
  default     = "us-east-1"
}

variable "github_repo" {
  description = "owner/repo allowed to assume the deploy role via OIDC."
  type        = string
  default     = "AdamAurelio/AdamAurelioDotCom"
}

variable "github_branch" {
  description = "Branch the OIDC role trusts (the deploy workflow runs on this branch)."
  type        = string
  default     = "main"
}

variable "iam_role_name" {
  description = "Name of the IAM role GitHub Actions assumes to DEPLOY (least-privilege)."
  type        = string
  default     = "github-actions-adamaurelio-deploy"
}

variable "provision_iam_role_name" {
  description = "Name of the IAM role the gated Infra workflow assumes to PROVISION the stack."
  type        = string
  default     = "github-actions-adamaurelio-provision"
}

variable "tf_state_bucket_arn" {
  description = "ARN of the S3 bucket holding Terraform remote state (created by infra/scripts/bootstrap-state.sh). The provision role gets read/write on it."
  type        = string
  default     = "arn:aws:s3:::adamaurelio-tfstate"
}

variable "price_class" {
  description = "CloudFront price class. PriceClass_100 = NA + Europe (cheapest)."
  type        = string
  default     = "PriceClass_100"
}

variable "create_oidc_provider" {
  description = "Create the GitHub OIDC provider. Set false if one already exists in this account (only one per account is allowed) and pass existing_oidc_provider_arn."
  type        = bool
  default     = true
}

variable "existing_oidc_provider_arn" {
  description = "ARN of a pre-existing GitHub OIDC provider, used when create_oidc_provider = false."
  type        = string
  default     = ""
}

variable "manage_github_actions_config" {
  description = "If true, Terraform writes AWS_ROLE_ARN / AWS_REGION / S3_BUCKET / CLOUDFRONT_DISTRIBUTION_ID into the repo's Actions config (requires GITHUB_TOKEN env var)."
  type        = bool
  default     = false
}

variable "tags" {
  description = "Tags applied to every taggable resource."
  type        = map(string)
  default = {
    Project   = "adamaurelio.com"
    ManagedBy = "Terraform"
  }
}
