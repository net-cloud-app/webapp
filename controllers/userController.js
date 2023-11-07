const User = require('../models/User');
const winston = require('winston'); // Import Winston

// GET all users (no authentication required) and handle DELETE requests
exports.getAllUsers = async (req, res) => {
  try {
    if (req.method === 'DELETE') {
      // Log a "Method Not Allowed" message and return a "Method Not Allowed" response for DELETE requests
      winston.warn('DELETE request not allowed for getting users');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    // Log an error message and return an appropriate error response
    winston.error('Error retrieving users:', error);

    if (error instanceof MyCustomError) {
      // Handle your custom error with a specific status code
      return res.status(400).json({ error: 'Bad Request' });
    }

    // Handle other generic errors with a 500 Internal Server Error
    res.status(500).json({ error: 'Internal Server Error' });
  }
};











// const User = require('../models/User');

// // GET all users (no authentication required) and handle DELETE requests
// exports.getAllUsers = async (req, res) => {
//   try {
//     if (req.method === 'DELETE') {
//       // Return a "Method Not Allowed" response for DELETE requests
//       return res.status(405).json({ error: 'Method Not Allowed' });
//     }

//     const users = await User.findAll();
//     res.status(200).json(users);
//   } catch (error) {
//     console.error('Error retrieving users:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };
