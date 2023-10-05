const basicAuth = require('basic-auth');
const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const credentials = basicAuth(req);

  if (!credentials || !credentials.name || !credentials.pass) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = await User.findOne({ where: { email: credentials.name } });

    if (!user || !bcrypt.compareSync(credentials.pass, user.password)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
