# Terraform + provider version constraints.
# Pin majors so a future provider release can't silently change behavior.
terraform {
  required_version = ">= 1.5.0"

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

  # State lives locally by default (fine for a solo personal site; it is
  # gitignored). To share/lock state, uncomment and create the bucket first:
  #
  # backend "s3" {
  #   bucket = "adamaurelio-tfstate"
  #   key    = "prod/terraform.tfstate"
  #   region = "us-east-1"
  # }
}
