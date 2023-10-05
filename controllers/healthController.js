// controllers/healthController.js
const sequelize = require('../config/database');

exports.checkHealth = async (req, res) => {
  try {
    // Check the database connection
    await sequelize.authenticate();

    // If the database connection is successful, return a 200 OK response
    res.status(200).json({ message: 'Server is healthy' });
  } catch (error) {
    // If the database connection fails, return a 503 Service Unavailable response
    res.status(503).json({ error: 'Service Unavailable' });
  }
};
