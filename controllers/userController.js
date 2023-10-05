const User = require('../models/User');

// GET all users (no authentication required) and handle DELETE requests
exports.getAllUsers = async (req, res) => {
  try {
    if (req.method === 'DELETE') {
      // Return a "Method Not Allowed" response for DELETE requests
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
