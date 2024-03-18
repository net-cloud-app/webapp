# webapp
## Prerequisites    

- Node.js and npm installed on your development machine. wrgeg       
- MySQL or MariaDB installed on your server with a configured database.
- Sequelize CLI (`npx sequelize-cli`) installed globally.

## Getting Started

To build and deploy the application locally, follow these steps:   

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/assignment-management-system.git
   cd assignment-management-system


## install dependencies

npm i

## Database Configuration 

Database Configuration:

Create a MySQL or MariaDB database for the application.

## Run Migrations 

npx sequelize-cli db:migrate

## start the application 

npm start or node.js

## Usage
Access the API documentation by navigating to http://localhost:3000/api/assignments or healthz in your web browser for detailed API endpoints and request examples.

## Command to import SSL Certificate

aws acm import-certificate \
    --profile demo \
    --certificate fileb:///Users/harish/Downloads/demo_harishnetcloud.site/demo_harishnetcloud_site.crt \
    --private-key fileb:///Users/harish/Downloads/ssl/ssl-private-key.key \
    --certificate-chain fileb:///Users/harish/Downloads/demo_harishnetcloud.site/demo_harishnetcloud_site.ca-bundle \
    --region us-east-1

