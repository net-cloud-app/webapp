const bcrypt = require('bcrypt');
const User = require('../models/User');
const basicAuth = require('basic-auth');

module.exports = {
  login: async (req, res) => {
    const credentials = basicAuth(req);

    if (!credentials || !credentials.name || !credentials.pass) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const user = await User.findOne({ where: { email: credentials.name } });

      if (!user || !bcrypt.compareSync(credentials.pass, user.password)) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // generating token here
      //revisit 
      const token = generateAuthToken(user); // Implement a function to generate a token
      res.status(200).json({ message: 'Authentication successful', token });
      


      // Basic Authentication
      res.status(200).json({ message: 'Authentication successful', user });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};
