// controllers/healthController.js
const sequelize = require('../config/database');
// const winston = require('winston');
const { logger } = require('../app'); // Import the logger from app.js
const { statsd } = require('../app');



exports.checkHealth = async (req, res) => {
  try {
    statsd.increment('Health.get');
    // Check the database connection
    await sequelize.authenticate();

    // If the database connection is successful, return a 200 OK response
    logger.info('Database connection successful');
    res.status(200).json({ message: 'Server is healthy' });
  } catch (error) {
    // If the database connection fails, return a 503 Service Unavailable response
    logger.error('Database connection error:', error);
    res.status(503).json({ error: 'Service Unavailable' });
  }
};
