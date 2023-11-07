#!/bin/bash

sudo apt update

sudo apt install -y nodejs npm

sudo apt update

sudo apt-get install expect

sudo apt install -y unzip

npm install express sequelize mysql2 body-parser bcrypt basic-auth

npm uninstall bcrypt

npm install bcrypt

npm install csv-parser --save

npm install chai-http --save-dev

npm install dotenv

npm install winston

npm install node-statsd

npm install


file_to_edit="/opt/csye6225/migrations/20231001203320-create-assignment.js"

# Define the expect script
expect_script=$(cat << EOF
spawn sudo nano $file_to_edit
expect "File Name to Write: "
send "\x1B:wq\n"
expect eof
EOF
)

# Execute the expect script
echo "$expect_script" | expect

# Sleep for 10 seconds
sleep 10




