resource "aws_sns_topic" "alerts" {
  name = "cloudforge-alerts"
}

resource "aws_sns_topic_subscription" "email" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = "example@example.com" # Change this to your email
}

output "sns_topic_arn" {
  value = aws_sns_topic.alerts.arn
}
