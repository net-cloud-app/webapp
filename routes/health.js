const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

const { logger } = require('../app'); // Import the logger from app.js


router.get('/healthz', async (req, res) => {
  try {
    // Check if the database is connected
    await sequelize.authenticate();
    logger.info('Database connection successful');
    res.sendStatus(200); // Send a 200 OK response without a body
  } catch (error) {
    console.error('Database connection error:', error);
    logger.error('Database connection error:', error);
    res.sendStatus(503); // Send a 503 Service Unavailable response without a body
  }
});

module.exports = router;
