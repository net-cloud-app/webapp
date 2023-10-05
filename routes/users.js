const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// GET all users (no authentication required)
router.get('/users', UserController.getAllUsers);

// DELETE user by ID (Method Not Allowed)
router.delete('/users/:id', (req, res) => {
  res.status(405).json({ error: 'Method Not Allowed' });
});

module.exports = router;
