const User = require('../models/User');
const { logger } = require('../app'); // Import the logger from app.js


// GET all users (no authentication required) and handle DELETE requests
exports.getAllUsers = async (req, res) => {
  try {
    req.app.locals.statsd.increment('getAllUsers.api_call');
    if (req.method === 'DELETE') {
      // Log a "Method Not Allowed" message and return a "Method Not Allowed" response for DELETE requests
      logger.warn('DELETE request not allowed for getting users');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const users = await User.findAll();
    logger.info("Retrieved all Users");
    res.status(200).json(users);
  } catch (error) {
    // Log an error message and return an appropriate error response
    logger.error('Error retrieving users:', error);

    if (error instanceof Error) {
      // Handle standard JavaScript errors with a specific status code
      logger.warn('Error encountered:', error);
      return res.status(400).json({ error: 'Bad Request' });
    }

    // Handle other generic errors with a 500 Internal Server Error
    logger.error('Internal server error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
