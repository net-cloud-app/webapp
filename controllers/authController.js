const bcrypt = require('bcrypt');
const User = require('../models/User');
const basicAuth = require('basic-auth');
// const winston = require('winston');

const { logger } = require('../app'); // Import the logger from app.js

const { statsd } = require('../app');




module.exports = {
  login: async (req, res) => {
    const credentials = basicAuth(req);

    if (!credentials || !credentials.name || !credentials.pass) {
      logger.warn('Authentication failed: Unauthorized');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      statsd.increment('login.api_call');
      const user = await User.findOne({ where: { email: credentials.name } });

      if (!user || !bcrypt.compareSync(credentials.pass, user.password)) {
        logger.warn('Authentication failed: Unauthorized');
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = generateAuthToken(user); // Implement a function to generate a token

      logger.info('Authentication successful: User authenticated');
      res.status(200).json({ message: 'Authentication successful', token });
    } catch (error) {
      logger.error('Authentication failed: Internal server error', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};
