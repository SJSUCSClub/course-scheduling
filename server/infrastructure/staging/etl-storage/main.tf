module "etl_storage"{
    source = "terraform-aws-modules/s3-bucket/aws"
    bucket = var.bucket
    server_side_encryption_configuration = {
        rule={
            apply_server_side_encryption_by_default = {
                sse_algorithm = "AES256"
            }
        }
    }

    block_public_acls = true
    ignore_public_acls = true
    block_public_policy = true
    restrict_public_buckets = true
    
    attach_policy = true

    policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                Sid = "AllowOnlySpecificRoles"
                Effect = "Allow"
                Principal = {
                   AWS =  var.cource_scheduler_etl_role
                }
                Action = [
                    "s3:PutObject",
                    "s3:GetObject",
                ]
                Resource = "${module.etl_storage.s3_bucket_arn}/*"
            },
        ]
    })
    cors_rule = [
        {
            allowed_headers = ["*"]
            allowed_methods = ["PUT","GET"]
            allowed_origins = ["http://localhost"]
            expose_headers = []
        }

    ]
}
