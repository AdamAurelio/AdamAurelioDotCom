# Terraform + provider version constraints.
# Pin majors so a future provider release can't silently change behavior.
terraform {
  # 1.10+ for native S3 state locking (use_lockfile) — no DynamoDB table needed.
  required_version = ">= 1.10.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
    github = {
      source  = "integrations/github"
      version = "~> 6.0"
    }
  }

  # Remote, locked state so `terraform apply` can run in CI (the Infra workflow)
  # as well as locally without clobbering each other. The bucket must exist first
  # — create it once with infra/scripts/bootstrap-state.sh (chicken-and-egg: the
  # backend can't store state in a bucket that doesn't yet exist). See ADR-0007.
  backend "s3" {
    bucket       = "adamaurelio-tfstate"
    key          = "prod/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true # native S3 lock object; replaces the old DynamoDB table
  }
}
