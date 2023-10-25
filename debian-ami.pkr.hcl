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

// variable "vpc_id" {
//   type        = string
//   description = "The VPC ID to use"
// }

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
  // vpc_id        = var.vpc_id
  // subnet_id     = var.subnet_id
  region = var.aws_region

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
      "sudo groupadd csye6225",
      "sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225",
      "sudo mv my-repo-files.zip /opt/csye6225/ ",
      "cd /opt/csye6225",
      "sudo apt install -y nodejs npm",
      "sudo apt update",
      "sudo apt install -y unzip",
      "unzip my-repo-files.zip -d .",
      "sudo chown -R csye6225:csye6225 /opt/csye6225"
      "npm install express sequelize mysql2 body-parser bcrypt basic-auth",
      "npm uninstall bcrypt",
      "npm install bcrypt",
      "npm install csv-parser --save",
      "npm install chai-http --save-dev",
      "npm install",
      "sudo apt remove git -y",
      "sudo mv app.service /etc/systemd/system/",
      "sudo systemctl daemon-reload",
      "sudo systemctl enable app",
      "sudo systemctl start app"
    ]
  }


}
