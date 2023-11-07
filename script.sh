#!/bin/bash

sudo apt update

sudo apt install -y nodejs npm

sudo apt update

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

# Edit the file with nano
sudo nano -S "$file_to_edit" << EOL
\cX
EOL



