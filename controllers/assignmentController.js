const Assignment = require('../models/Assignment');
// const winston = require('winston');
const { logger } = require('../app'); // Import the logger from app.js


module.exports = {
  createAssignment: async (req, res) => {
    try {
      statsd.increment('Assignment.Create');
      const { name, points, NoOfAttempts } = req.body;

      if (!name || points < 1 || points > 10 || NoOfAttempts === null) {
        logger.warn('Create Assignment: Invalid input data');
        return res.status(400).json({ error: 'Invalid input data' });
      }

      const assignmentData = {
        ...req.body,
        createdBy: req.user.id,
      };

      const assignment = await Assignment.create(assignmentData);
      logger.info('Create Assignment: Assignment created', { assignmentId: assignment.id });
      res.status(201).json(assignment);
    } catch (error) {
      logger.error('Create Assignment: Internal server error', { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateAssignment: async (req, res) => {
    try {
      statsd.increment('Assignment.Update');
      const assignment = await Assignment.findOne({
        where: { id: req.params.id, createdBy: req.user.id },
      });

      if (!assignment) {
        logger.warn('Update Assignment: Assignment not found', { assignmentId: req.params.id });
        return res.status(404).json({ error: 'Assignment not found' });
      }

      // Check if the request body contains the 'updatedAt' field
      if (req.body.updatedAt) {
        logger.warn("Update Assignment: Updating updatedAt field is not allowed", { assignmentId: assignment.id });
        return res.status(400).json({ error: "Updating updatedAt field is not allowed" });
      }

      const { name, points, NoOfAttempts } = req.body;

      if (name === null || points < 1 || points > 10 || points < 1 || NoOfAttempts === null) {
        logger.warn('Update Assignment: Invalid input data', { assignmentId: assignment.id });
        return res.status(400).json({ error: 'Invalid input data' });
      }

      // Updating the assignment
      await assignment.update(req.body);

      logger.info("Update Assignment: Assignment updated", { assignmentId: assignment.id });
      res.status(204).json(assignment);
    } catch (error) {
      logger.error("Update Assignment: Internal server error", { error });
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getUserAssignments: async (req, res) => {
    try {
      statsd.increment('Assignment.getAll');
      const assignment = await Assignment.findAll({
        where: { createdBy: req.user.id },
      });

      if (!assignment || assignment.length === 0) {
        logger.warn('Get User Assignments: Assignments not found for user', { userId: req.user.id });
        return res.status(404).json({ error: 'Assignments not found' });
      }

      logger.info("Get User Assignments: Assignments retrieved", { userId: req.user.id });
      res.status(200).json(assignment);
    } catch (error) {
      logger.error("Get User Assignments: Internal server error", { error });
      res.status(500).json({ error: "Internal server error" });
    }
  },

  deleteAssignment: async (req, res) => {
    try {
      statsd.increment('Assignment.delete');
      const assignment = await Assignment.findOne({
        where: { id: req.params.id, createdBy: req.user.id },
      });

      if (!assignment) {
        logger.warn('Delete Assignment: Assignment not found', { assignmentId: req.params.id });
        return res.status(404).json({ error: 'Assignment not found' });
      }

      // Deleting the assignment
      await assignment.destroy();

      logger.info("Delete Assignment: Assignment deleted", { assignmentId: req.params.id });
      res.status(204).send(); // No content
    } catch (error) {
      logger.error("Delete Assignment: Internal server error", { error });
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getUserAssignmentsById: async (req, res) => {
    try {
      statsd.increment('Assignment.getbyID');
      const assignment = await Assignment.findOne({
        where: { id: req.params.id, createdBy: req.user.id },
      });

      if (!assignment) {
        logger.warn('Get User Assignments by ID: Assignment not found', { assignmentId: req.params.id });
        return res.status(404).json({ error: 'Assignment not found' });
      }

      logger.info("Get User Assignments by ID: Assignment retrieved", { assignmentId: req.params.id });
      res.status(200).json(assignment);
    } catch (error) {
      logger.error("Get User Assignments by ID: Internal server error", { error });
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
