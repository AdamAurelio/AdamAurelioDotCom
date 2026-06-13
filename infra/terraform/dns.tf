# Alias records (apex + www, A + AAAA) pointing the domain at CloudFront.
# Aliases are free in Route 53 and resolve straight to the distribution.
locals {
  alias_records = {
    for pair in setproduct([var.domain_name, "www.${var.domain_name}"], ["A", "AAAA"]) :
    "${pair[0]}-${pair[1]}" => { name = pair[0], type = pair[1] }
  }
}

resource "aws_route53_record" "alias" {
  for_each = local.alias_records

  zone_id = data.aws_route53_zone.this.zone_id
  name    = each.value.name
  type    = each.value.type

  alias {
    name                   = aws_cloudfront_distribution.this.domain_name
    zone_id                = aws_cloudfront_distribution.this.hosted_zone_id
    evaluate_target_health = false
  }
}
