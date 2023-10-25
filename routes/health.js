const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

router.get('/healthz', async (req, res) => {
  try {
    // Check if the database is connected
    await sequelize.authenticate();
    res.status(200);
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(503);
  }
});

module.exports = router;
