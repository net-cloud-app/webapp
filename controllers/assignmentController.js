const Assignment = require('../models/Assignment');
const winston = require('winston');

module.exports = {
  createAssignment: async (req, res) => {
    try {
      const { name, points, NoOfAttempts } = req.body;

      if (!name || points < 1 || points > 10 || NoOfAttempts === null) {
        winston.error('Create Assignment: Invalid input data');
        return res.status(400).json({ error: 'Invalid input data' });
      }

      const assignmentData = {
        ...req.body,
        createdBy: req.user.id,
      };

      const assignment = await Assignment.create(assignmentData);
      winston.info('Create Assignment: Assignment created');
      res.status(201).json(assignment);
    } catch (error) {
      winston.error('Create Assignment: Internal server error', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateAssignment: async (req, res) => {
    try {
      const assignment = await Assignment.findOne({
        where: { id: req.params.id, createdBy: req.user.id },
      });

      if (!assignment) {
        winston.error('Update Assignment: Assignment not found');
        return res.status(404).json({ error: 'Assignment not found' });
      }

      // Check if the request body contains the 'updatedAt' field
      if (req.body.updatedAt) {
        winston.error("Update Assignment: Updating updatedAt field is not allowed");
        return res.status(400).json({ error: "Updating updatedAt field is not allowed" });
      }

      const { name, points, NoOfAttempts } = req.body;

      if (name === null || points < 1 || points > 10 || points < 1 || NoOfAttempts === null) {
        winston.error('Update Assignment: Invalid input data');
        return res.status(400).json({ error: 'Invalid input data' });
      }

      // Updating the assignment
      await assignment.update(req.body);

      winston.info("Update Assignment: Assignment updated");
      res.status(204).json(assignment);
    } catch (error) {
      winston.error("Update Assignment: Internal server error", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getUserAssignments: async (req, res) => {
    try {
      const assignment = await Assignment.findAll({
        where: { createdBy: req.user.id },
      });

      if (!assignment) {
        winston.error('Get User Assignments: Assignment not found');
        return res.status(404).json({ error: 'Assignment not found' });
      }

      winston.info("Get User Assignments: Assignments retrieved");
      res.status(200).json(assignment);
    } catch (error) {
      winston.error("Get User Assignments: Internal server error", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  deleteAssignment: async (req, res) => {
    try {
      const assignment = await Assignment.findOne({
        where: { id: req.params.id, createdBy: req.user.id },
      });

      if (!assignment) {
        winston.error('Delete Assignment: Assignment not found');
        return res.status(404).json({ error: 'Assignment not found' });
      }

      // Deleting the assignment
      await assignment.destroy();

      winston.info("Delete Assignment: Assignment deleted");
      res.status(204).send(); // No content
    } catch (error) {
      winston.error("Delete Assignment: Internal server error", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getUserAssignmentsById: async (req, res) => {
    try {
      const assignment = await Assignment.findOne({
        where: { id: req.params.id, createdBy: req.user.id },
      });

      if (!assignment) {
        winston.error('Get User Assignments by ID: Assignment not found');
        return res.status(404).json({ error: 'Assignment not found' });
      }

      winston.info("Get User Assignments by ID: Assignment retrieved");
      res.status(200).json(assignment);
    } catch (error) {
      winston.error("Get User Assignments by ID: Internal server error", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};



// const Assignment = require('../models/Assignment');

// module.exports = {
//   createAssignment: async (req, res) => {
//     try {
//       if (!req.body.name) {
//         return res.status(400).json({ error: 'Name is required' });
//       }

//       const assignmentData = {
//         ...req.body,
//         createdBy: req.user.id,
//       };

//       const assignment = await Assignment.create(assignmentData);
//       res.status(201).json(assignment);
//     } catch (error) {
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   },

//   updateAssignment: async (req, res) => {
//     try {
//       const assignment = await Assignment.findOne({
//         where: { id: req.params.id, createdBy: req.user.id },
//       });
  
//       if (!assignment) {
//         return res.status(404).json({ error: 'Assignment not found' });
//       }
  
//       // Check if the request body contains the 'updatedAt' field
//       if (req.body.updatedAt) {
//         return res.status(400).json({ error: 'Updating updatedAt field is not allowed' });
//       }
  
//       // Updating the assignment
//       await assignment.update(req.body);
  
//       res.status(204).json(assignment);
//     } catch (error) {
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   },

//   getUserAssignments: async (req, res) => {
//     // try {
//     //   const user = req.user; // The authenticated user obtained from middleware
//     //   const assignments = await Assignment.findAll({
//     //     where: { createdBy: user.id },
//     //   });

//     //   res.status(200).json(assignments);
//     // } catch (error) {
//     //   console.error('Error retrieving user assignments:', error);
//     //   res.status(500).json({ error: 'Internal server error' });
//     // }

//     try {
//       const assignment = await Assignment.findAll({
//         where: { createdBy: req.user.id },
//       });

//       if (!assignment) {
//         return res.status(404).json({ error: 'Assignment not found' });
//       }

//       // Update the assignment


//       res.status(200).json(assignment);
//     } catch (error) {
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   },



//   deleteAssignment: async (req, res) => {
//     try {
//       const assignment = await Assignment.findOne({
//         where: { id: req.params.id, createdBy: req.user.id },
//       });

//       if (!assignment) {
//         return res.status(404).json({ error: 'Assignment not found' });
//       }

//       // Deleting the assignment
//       await assignment.destroy();

//       res.status(204).send(); // No content
//     } catch (error) {
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   },

//   getUserAssignmentsById: async (req, res) => {
//     try {
//       const assignment = await Assignment.findOne({
//         where: { id: req.params.id, createdBy: req.user.id },
//       });

//       if (!assignment) {
//         return res.status(404).json({ error: 'Assignment not found' });
//       }

//       // Update the assignment


//       res.status(200).json(assignment);
//     } catch (error) {
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   },


// };
