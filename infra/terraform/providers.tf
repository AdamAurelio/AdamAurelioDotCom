# Default provider — bucket, IAM, Route 53.
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = var.tags
  }
}

# CloudFront only serves ACM certs from us-east-1, regardless of bucket region.
# This aliased provider is used solely for the certificate.
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = var.tags
  }
}

# Used only when manage_github_actions_config = true, to write the repo's
# Actions secret/variables. Authenticates via the GITHUB_TOKEN env var.
provider "github" {
  owner = split("/", var.github_repo)[0]
}
