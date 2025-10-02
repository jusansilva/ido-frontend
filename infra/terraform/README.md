Deploy S3 + CloudFront (Terraform)

Prereqs
- Terraform >= 1.5
- AWS credentials with permissions for S3, CloudFront

Usage
- Initialize: `terraform init`
- Plan: `terraform plan -var="project_name=idoe-frontend" -var="aws_region=us-east-1"`
- Apply: `terraform apply -auto-approve -var="project_name=idoe-frontend" -var="aws_region=us-east-1"`

Outputs
- `s3_bucket_name`: upload target for static site
- `cloudfront_distribution_id`: use for cache invalidations
- `cloudfront_domain_name`: public URL (unless you add a custom domain)

Notes
- Bucket is private; CloudFront uses Origin Access Control.
- SPA routing is enabled via error responses mapping 403/404 to `/index.html`.
- For a custom domain + HTTPS via ACM, extend the distribution with `aliases` and an ACM certificate in `us-east-1`.

