terraform {
  backend "s3" {
    bucket         = "cloudforge-tf-state-164971840296"
    key            = "global/s3/terraform.tfstate"
    region         = "ap-south-1"
    dynamodb_table = "cloudforge-tf-locks"
    encrypt        = true
  }
}
