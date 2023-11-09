const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/assignments', assignmentController.createAssignment);
router.put('/assignments/:id', assignmentController.updateAssignment);
// router.patch('/assignments/:id', assignmentController.updateAssignment);
router.delete('/assignments/:id', assignmentController.deleteAssignment);
router.get('/assignments', assignmentController.getUserAssignments);
router.get('/assignments/:id', assignmentController.getUserAssignmentsById);

router.patch('/assignments/:id', (req, res) => {
    res.status(405).json({ error: 'Method Not Allowed' });
});




//ehgfegfuygyuefgyg




module.exports = router;
