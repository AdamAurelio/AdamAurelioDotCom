# --- GitHub OIDC provider (one per AWS account) ----------------------------
# Fetch the current TLS thumbprint dynamically rather than hardcoding it.
data "tls_certificate" "github" {
  count = var.create_oidc_provider ? 1 : 0
  url   = "https://token.actions.githubusercontent.com/.well-known/openid-configuration"
}

resource "aws_iam_openid_connect_provider" "github" {
  count           = var.create_oidc_provider ? 1 : 0
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.github[0].certificates[0].sha1_fingerprint]
}

locals {
  oidc_provider_arn = var.create_oidc_provider ? aws_iam_openid_connect_provider.github[0].arn : var.existing_oidc_provider_arn
}

# --- Role assumed by GitHub Actions, scoped to this repo + branch ----------
data "aws_iam_policy_document" "assume" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [local.oidc_provider_arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${var.github_repo}:ref:refs/heads/${var.github_branch}"]
    }
  }
}

resource "aws_iam_role" "github_actions" {
  name               = var.iam_role_name
  description        = "Assumed by GitHub Actions via OIDC to deploy ${var.domain_name}"
  assume_role_policy = data.aws_iam_policy_document.assume.json
}

# Least privilege: write the bucket + create CloudFront invalidations. Nothing else.
data "aws_iam_policy_document" "deploy" {
  statement {
    sid       = "S3Deploy"
    actions   = ["s3:ListBucket", "s3:PutObject", "s3:DeleteObject"]
    resources = [aws_s3_bucket.this.arn, "${aws_s3_bucket.this.arn}/*"]
  }

  statement {
    sid       = "CloudFrontInvalidate"
    actions   = ["cloudfront:CreateInvalidation"]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "deploy" {
  name   = "deploy-policy"
  role   = aws_iam_role.github_actions.id
  policy = data.aws_iam_policy_document.deploy.json
}

# --- Role assumed by the Infra workflow to PROVISION the stack -----------------
# Separate from the deploy role on purpose: provisioning needs broad powers
# (CloudFront/ACM/Route53/S3/IAM + the tfstate bucket), while the deploy role
# stays least-privilege. Trust is scoped to the `production` GitHub Environment,
# so the role is only assumable from a job that has passed the environment's
# required-reviewer gate — not from any branch push. See ADR-0007.
data "aws_iam_policy_document" "provision_assume" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [local.oidc_provider_arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    # environment:production — the gate is the GitHub Environment's reviewers.
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${var.github_repo}:environment:production"]
    }
  }
}

resource "aws_iam_role" "github_actions_provision" {
  name               = var.provision_iam_role_name
  description        = "Assumed by the Infra workflow (gated) to provision ${var.domain_name}"
  assume_role_policy = data.aws_iam_policy_document.provision_assume.json
}

# Scoped to the services this stack actually uses, plus read/write of the
# remote state bucket. Deliberately NOT AdministratorAccess.
data "aws_iam_policy_document" "provision" {
  statement {
    sid = "StackServices"
    actions = [
      "s3:*",
      "cloudfront:*",
      "acm:*",
      "route53:*",
      "iam:*",
    ]
    resources = ["*"]
  }

  statement {
    sid       = "TerraformState"
    actions   = ["s3:ListBucket", "s3:GetObject", "s3:PutObject", "s3:DeleteObject"]
    resources = [var.tf_state_bucket_arn, "${var.tf_state_bucket_arn}/*"]
  }
}

resource "aws_iam_role_policy" "provision" {
  name   = "provision-policy"
  role   = aws_iam_role.github_actions_provision.id
  policy = data.aws_iam_policy_document.provision.json
}
