const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { logger } = require('../app'); // Import the logger from app.js


// GET all users (no authentication required)
router.get('/users', UserController.getAllUsers);

// DELETE user by ID (Method Not Allowed)
router.delete('/users/:id', (req, res) => {
  logger.warn('Uer Deletion Not Allowed');
  res.status(405).json({ error: 'Method Not Allowed' });
});

module.exports = router;
