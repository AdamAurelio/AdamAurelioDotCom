#!/usr/bin/env bash
#
# bootstrap-state.sh — create the S3 bucket that holds Terraform's remote state.
#
# This is the ONE chicken-and-egg step: the S3 backend in versions.tf cannot
# store state in a bucket that does not exist yet, so the bucket is created here
# with the AWS CLI (admin credentials) before the very first `terraform init`.
# It is idempotent — safe to re-run; it no-ops if the bucket already exists.
#
# After this runs once, all state lives in the bucket and is locked natively
# (use_lockfile = true), so `terraform apply` works from CI and locally alike.
# See docs/adr/0007-ci-driven-gated-provisioning.md.
#
# Usage (once, with admin AWS creds):
#   ./infra/scripts/bootstrap-state.sh
#
# Config (env overrides):
#   TF_STATE_BUCKET   state bucket name   (default: adamaurelio-tfstate)
#   AWS_REGION        bucket region       (default: us-east-1)
set -euo pipefail

BUCKET="${TF_STATE_BUCKET:-adamaurelio-tfstate}"
REGION="${AWS_REGION:-us-east-1}"

log() { echo "[bootstrap-state] $*"; }

command -v aws >/dev/null 2>&1 || { echo "ERROR: aws CLI not found." >&2; exit 1; }

if aws s3api head-bucket --bucket "$BUCKET" >/dev/null 2>&1; then
  log "Bucket s3://$BUCKET already exists — nothing to create."
else
  log "Creating s3://$BUCKET in $REGION ..."
  # us-east-1 is the one region that must NOT get a LocationConstraint.
  if [ "$REGION" = "us-east-1" ]; then
    aws s3api create-bucket --bucket "$BUCKET" --region "$REGION"
  else
    aws s3api create-bucket --bucket "$BUCKET" --region "$REGION" \
      --create-bucket-configuration "LocationConstraint=$REGION"
  fi
fi

log "Enforcing versioning (so state history is recoverable)..."
aws s3api put-bucket-versioning --bucket "$BUCKET" \
  --versioning-configuration Status=Enabled

log "Enforcing default encryption (SSE-S3)..."
aws s3api put-bucket-encryption --bucket "$BUCKET" \
  --server-side-encryption-configuration \
  '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"},"BucketKeyEnabled":true}]}'

log "Blocking all public access (state must never be public)..."
aws s3api put-public-access-block --bucket "$BUCKET" \
  --public-access-block-configuration \
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

log "Done. State bucket s3://$BUCKET is ready."
log "Next: cd infra/terraform && terraform init && terraform apply  (admin creds, first run only)."
