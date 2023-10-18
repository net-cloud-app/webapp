packer {
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon"
      version = "~> 1"
    }
  }
}

variable "demo_account_id" {
  type        = string
  description = "this is the demo accout id "
}

variable "source_ami" {
  type        = string
  description = "The source AMI ID to use as a base"
}

variable "ami_name" {
  type        = string
  description = "The name of the custom AMI"
}

variable "vpc_id" {
  type        = string
  description = "The VPC ID to use"
}

// variable "subnet_id" {
//   type        = string
//   description = "The subnet ID to use"
// }

variable "aws_region" {
  type        = string
  description = "The aws region ID to use"
}

variable "aws_access_key" {
  type        = string
  description = "AWS access key"
}

variable "aws_secret_access_key" {
  type        = string
  description = "AWS secret key"
}



source "amazon-ebs" "custom" {
  ami_name      = var.ami_name
  source_ami    = var.source_ami
  instance_type = "t2.micro"
  ssh_username  = "admin"
  vpc_id        = var.vpc_id
  // subnet_id     = var.subnet_id
  region        = var.aws_region

  access_key = var.aws_access_key
  secret_key = var.aws_secret_access_key


  ami_users = [var.demo_account_id] # Add the AWS account IDs that can use the AMI

}


build {
  sources = ["source.amazon-ebs.custom"]

  provisioner "shell" {
    inline = [
      "echo 'Customization steps here'",
      "sudo apt-get update",
      "echo 'Additional customization steps here'",
      "sudo apt install -y zip"
    ]
  }

  provisioner "file" {
    source      = "my-repo-files.zip"
    destination = "~/my-repo-files.zip"
  }

  provisioner "shell" {
    inline = [
      "sudo apt update",
      "sudo apt install -y nodejs npm",
      "sudo apt update",
      "sudo apt install -y mariadb-server",
      "sudo systemctl start mariadb",
      "sudo systemctl enable mariadb",
      "sudo apt install -y unzip",
      "sudo mysql_secure_installation <<EOF",
      "password",
      "y",
      "y",
      "password",
      "password",
      "y",
      "y",
      "y",
      "y",
      "EOF",
      "unzip my-repo-files.zip",
      "mysql -u root -p -e 'CREATE DATABASE db1;' <<EOF",
      "password",
      "EOF",
      "npm install express sequelize mysql2 body-parser bcrypt basic-auth",
      "npm install csv-parser --save",
      "npm install chai-http --save-dev",
      "npx sequelize-cli db:migrate <<EOF",
      "y",
      "EOF",
      "npm install",
      "sudo apt remove git -y"
    ]
  }


}
