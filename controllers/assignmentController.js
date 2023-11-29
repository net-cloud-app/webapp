const Assignment = require('../models/Assignment');
const winston = require('winston');
const { logger } = require('../app'); // Import the logger from app.js
const { statsd } = require('../app');
const Submission = require('../models/Submission'); // Import the Submission model
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
require('dotenv').config(); // Load environment variables from .env file

// const snsClient = new SNSClient({ region: 'us-east-1' });

const snsClient = new SNSClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'AKIAQATIM76XUNPYYI6Q',
    secretAccessKey: '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',
  },
});





module.exports = {
  createAssignment: async (req, res) => {
    try {
      statsd.increment('createAssignment.api_call');
      const { name, points, NoOfAttempts, deadline } = req.body;

      if (!name || points < 1 || points > 10 || NoOfAttempts === null || !deadline) {
        logger.error('Create Assignment: Invalid input data');
        return res.status(400).json({ error: 'Invalid input data' });
      }

      const assignmentData = {
        ...req.body,
        createdBy: req.user.id,
      };

      const assignment = await Assignment.create(assignmentData);
      logger.info('Create Assignment: Assignment created');
      res.status(201).json(assignment);
    } catch (error) {
      logger.error('Create Assignment: Internal server error', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateAssignment: async (req, res) => {
    try {
      statsd.increment('updateAssignment.api_call');
      const assignment = await Assignment.findOne({
        where: { id: req.params.id, createdBy: req.user.id },
      });

      if (!assignment) {
        logger.error('Update Assignment: Assignment not found');
        return res.status(404).json({ error: 'Assignment not found' });
      }

      // Check if the request body contains the 'updatedAt' field
      if (req.body.updatedAt) {
        logger.error("Update Assignment: Updating updatedAt field is not allowed");
        return res.status(400).json({ error: "Updating updatedAt field is not allowed" });
      }

      const { name, points, NoOfAttempts, deadline } = req.body;

      if (name === null || points < 1 || points > 10 || NoOfAttempts === null || !deadline) {
        logger.error('Update Assignment: Invalid input data');
        return res.status(400).json({ error: 'Invalid input data' });
      }

      // Updating the assignment
      await assignment.update({ ...req.body, deadline });

      logger.info("Update Assignment: Assignment updated");
      res.status(204).json(assignment);
    } catch (error) {
      logger.error("Update Assignment: Internal server error", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getUserAssignments: async (req, res) => {
    try {
      statsd.increment('getUserAssignment.api_call');
      const assignments = await Assignment.findAll({
        where: { createdBy: req.user.id },
      });

      if (!assignments || assignments.length === 0) {
        logger.error('Get User Assignments: Assignments not found');
        return res.status(404).json({ error: 'Assignments not found' });
      }

      logger.info("Get User Assignments: Assignments retrieved");
      res.status(200).json(assignments);
    } catch (error) {
      logger.error("Get User Assignments: Internal server error", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  deleteAssignment: async (req, res) => {
    try {
      statsd.increment('deleteAssignment.api_call');
      const assignment = await Assignment.findOne({
        where: { id: req.params.id, createdBy: req.user.id },
      });

      if (!assignment) {
        logger.error('Delete Assignment: Assignment not found');
        return res.status(404).json({ error: 'Assignment not found' });
      }

      // Deleting the assignment
      await assignment.destroy();

      logger.info("Delete Assignment: Assignment deleted");
      res.status(204).send(); // No content
    } catch (error) {
      logger.error("Delete Assignment: Internal server error", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getUserAssignmentsById: async (req, res) => {
    try {
      statsd.increment('getUserIdAssignment.api_call');
      const assignment = await Assignment.findOne({
        where: { id: req.params.id, createdBy: req.user.id },
      });

      if (!assignment) {
        logger.error('Get User Assignments by ID: Assignment not found');
        return res.status(404).json({ error: 'Assignment not found' });
      }

      logger.info("Get User Assignments by ID: Assignment retrieved");
      res.status(200).json(assignment);
    } catch (error) {
      logger.error("Get User Assignments by ID: Internal server error", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  submitAssignment: async (req, res) => {
    try {
      statsd.increment('submitAssignment.api_call');
      const { id } = req.params;
      const { submission_url } = req.body;

      // Check if the assignment exists
      const assignment = await Assignment.findOne({
        where: { id, createdBy: req.user.id },
      });

      if (!assignment) {
        logger.error('Submit Assignment: Assignment not found');
        return res.status(404).json({ error: 'Assignment not found' });
      }

      // Check if the submission is allowed based on retries config
      const allowedAttempts = assignment.NoOfAttempts || 1;
      const submissionsCount = await Submission.count({
        where: { assignment_id: id },
      });

      if (submissionsCount >= allowedAttempts) {
        logger.error('Submit Assignment: Exceeded maximum number of attempts');
        return res.status(400).json({ error: 'Exceeded maximum number of attempts' });
      }

      // Check if the submission is allowed based on the due date
      if (assignment.deadline && new Date() > new Date(assignment.deadline)) {
        logger.error('Submit Assignment: Submission after the deadline is not allowed');
        return res.status(400).json({ error: 'Submission after the deadline is not allowed' });
      }

      // Save the submission
      const submission = await Submission.create({
        assignment_id: id,
        submission_url,
      });

      const snsParams = {
        TopicArn: process.env.SNS_TOPIC_ARN,
        Subject: 'New Assignment Submission',
        Message: `New submission for assignment ${id}: ${submission_url}`,
        MessageGroupId: new Date().getTime().toString(),
        MessageDeduplicationId: new Date().getTime().toString(),
        MessageAttributes: {
          'AWS.SNS.MOBILE.MPNS.Type': { DataType: 'String', StringValue: 'wns/badge' },
        },
      };

      await snsClient.send(new PublishCommand(snsParams));


      logger.info('Submit Assignment: Submission created');
      res.status(201).json(submission);
    } catch (error) {
      logger.error('Submit Assignment: Internal server error', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};
