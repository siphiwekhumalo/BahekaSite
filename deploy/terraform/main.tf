# Terraform configuration for Baheka Tech EC2 deployment
# This provides infrastructure as code for your EC2 setup

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Variables
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "domain_name" {
  description = "Domain name for the website"
  type        = string
  default     = "bahekatech.com"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.medium"
}

variable "key_name" {
  description = "EC2 Key Pair name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

# Data sources
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

data "aws_availability_zones" "available" {
  state = "available"
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "baheka-tech-vpc"
    Environment = var.environment
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "baheka-tech-igw"
    Environment = var.environment
  }
}

# Public Subnet
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true

  tags = {
    Name        = "baheka-tech-public-subnet"
    Environment = var.environment
  }
}

# Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name        = "baheka-tech-public-rt"
    Environment = var.environment
  }
}

# Route Table Association
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# Security Group
resource "aws_security_group" "web" {
  name        = "baheka-tech-web-sg"
  description = "Security group for Baheka Tech web server"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "baheka-tech-web-sg"
    Environment = var.environment
  }
}

# Elastic IP
resource "aws_eip" "main" {
  domain = "vpc"

  tags = {
    Name        = "baheka-tech-eip"
    Environment = var.environment
  }

  depends_on = [aws_internet_gateway.main]
}

# EC2 Instance
resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  key_name      = var.key_name
  subnet_id     = aws_subnet.public.id

  vpc_security_group_ids = [aws_security_group.web.id]

  root_block_device {
    volume_type = "gp3"
    volume_size = 20
    encrypted   = true
  }

  user_data = base64encode(templatefile("${path.module}/user_data.sh", {
    domain_name = var.domain_name
  }))

  tags = {
    Name        = "baheka-tech-web"
    Environment = var.environment
  }
}

# Associate Elastic IP
resource "aws_eip_association" "main" {
  instance_id   = aws_instance.web.id
  allocation_id = aws_eip.main.id
}

# Route 53 (optional - uncomment if you want to manage DNS with Terraform)
# resource "aws_route53_zone" "main" {
#   name = var.domain_name
#   
#   tags = {
#     Name        = "baheka-tech-zone"
#     Environment = var.environment
#   }
# }
# 
# resource "aws_route53_record" "main" {
#   zone_id = aws_route53_zone.main.zone_id
#   name    = var.domain_name
#   type    = "A"
#   ttl     = 300
#   records = [aws_eip.main.public_ip]
# }
# 
# resource "aws_route53_record" "www" {
#   zone_id = aws_route53_zone.main.zone_id
#   name    = "www.${var.domain_name}"
#   type    = "CNAME"
#   ttl     = 300
#   records = [var.domain_name]
# }

# Outputs
output "public_ip" {
  description = "Public IP address of the web server"
  value       = aws_eip.main.public_ip
}

output "public_dns" {
  description = "Public DNS name of the web server"
  value       = aws_instance.web.public_dns
}

output "ssh_command" {
  description = "SSH command to connect to the server"
  value       = "ssh -i ${var.key_name}.pem ubuntu@${aws_eip.main.public_ip}"
}

output "website_url" {
  description = "Website URL"
  value       = "https://${var.domain_name}"
}