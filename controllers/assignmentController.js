const Assignment = require('../models/Assignment');

module.exports = {
  createAssignment: async (req, res) => {
    try {
      if (!req.body.name) {
        return res.status(400).json({ error: 'Name is required' });
      }

      const assignmentData = {
        ...req.body,
        createdBy: req.user.id,
      };

      const assignment = await Assignment.create(assignmentData);
      res.status(201).json(assignment);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateAssignment: async (req, res) => {
    try {
      const assignment = await Assignment.findOne({
        where: { id: req.params.id, createdBy: req.user.id },
      });
  
      if (!assignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }
  
      // Check if the request body contains the 'updatedAt' field
      if (req.body.updatedAt) {
        return res.status(400).json({ error: 'Updating updatedAt field is not allowed' });
      }
  
      // Updating the assignment
      await assignment.update(req.body);
  
      res.status(204).json(assignment);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getUserAssignments: async (req, res) => {
    // try {
    //   const user = req.user; // The authenticated user obtained from middleware
    //   const assignments = await Assignment.findAll({
    //     where: { createdBy: user.id },
    //   });

    //   res.status(200).json(assignments);
    // } catch (error) {
    //   console.error('Error retrieving user assignments:', error);
    //   res.status(500).json({ error: 'Internal server error' });
    // }

    try {
      const assignment = await Assignment.findAll({
        where: { createdBy: req.user.id },
      });

      if (!assignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }

      // Update the assignment


      res.status(200).json(assignment);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },



  deleteAssignment: async (req, res) => {
    try {
      const assignment = await Assignment.findOne({
        where: { id: req.params.id, createdBy: req.user.id },
      });

      if (!assignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }

      // Deleting the assignment
      await assignment.destroy();

      res.status(204).send(); // No content
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getUserAssignmentsById: async (req, res) => {
    try {
      const assignment = await Assignment.findOne({
        where: { id: req.params.id, createdBy: req.user.id },
      });

      if (!assignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }

      // Update the assignment


      res.status(200).json(assignment);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },


};
