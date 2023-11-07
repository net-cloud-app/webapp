// controllers/healthController.js
const sequelize = require('../config/database');
const winston = require('winston');


exports.checkHealth = async (req, res) => {
  try {
    // Check the database connection
    await sequelize.authenticate();

    // If the database connection is successful, return a 200 OK response
    winston.info('Database connection successful');
    res.status(200).json({ message: 'Server is healthy' });
  } catch (error) {
    // If the database connection fails, return a 503 Service Unavailable response
    winston.error('Database connection error:', error);
    res.status(503).json({ error: 'Service Unavailable' });
  }
};
