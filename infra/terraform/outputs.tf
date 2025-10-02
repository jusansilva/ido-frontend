output "s3_bucket_name" {
  description = "S3 bucket for static site"
  value       = aws_s3_bucket.site.bucket
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.cdn.id
}

output "cloudfront_domain_name" {
  description = "CloudFront domain to access the site"
  value       = aws_cloudfront_distribution.cdn.domain_name
}

