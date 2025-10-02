variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name prefix for resources"
  type        = string
  default     = "idoe-frontend"
}

variable "bucket_name" {
  description = "Optional explicit S3 bucket name (must be globally unique). If empty, a name will be generated."
  type        = string
  default     = ""
}

