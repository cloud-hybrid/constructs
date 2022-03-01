variable "organization" {
    description = "Organization Name"
    default     = "Organization"
    type        = string
}

variable "environment" {
    description = "Target Cloud Environment"
    type        = string
}

variable "profile" {
    description = "Target Cloud Profile"
    default     = "default"
    type        = string
}

variable "region" {
    description = "Target Cloud Region"
    default     = "us-east-1"
    type        = string
}

variable "creator" {
    description = "Name (Human Identifiable)"
    type        = string
    default     = "Jacob Sanders"
}

variable "cloud" {
    description = "Cloud Provider"
    type        = string
    default     = "AWS"
}

variable "application" {
    description = "Application Name"
    type        = string
    default     = "TF"
}

variable "service" {
    description = "Application's Service Name"
    type        = string
    default     = "VPC"
}
