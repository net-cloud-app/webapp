#!/bin/bash

sudo apt update

sudo apt install -y nodejs npm

sudo apt update

sudo apt install -y mariadb-server

sudo systemctl start mariadb

sudo systemctl enable mariadb

sudo apt install -y unzip

sudo mysql_secure_installation <<EOF
password
y
y
password
password
y
y
y
y
EOF

mysql -u root -p -e "CREATE DATABASE db1;"
mysql -u root -p -e "CREATE USER 'root'@'localhost' IDENTIFIED BY 'password';"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON db1.* TO 'root'@'localhost';"
mysql -u root -p -e "FLUSH PRIVILEGES;"

npm install

npm install express sequelize mysql2 body-parser bcrypt basic-auth

npm install csv-parser --save

npm install chai-http --save-dev

npx sequelize-cli db:migrate <<EOF
y
EOF

# sudo apt-get install -y build-essential

# rm -rf node_modules package-lock.json

# npm install -g n
# n stable

npm install

npm start

