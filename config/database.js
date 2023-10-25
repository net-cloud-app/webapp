const { Sequelize } = require('sequelize');

// Loading database configuration from config.json
const config = require('../config.json')[process.env.NODE_ENV || 'development'];
ß
// Creating a Sequelize instance
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: false, // Disabling SQL query logging
  }
);

// Testing the database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;
