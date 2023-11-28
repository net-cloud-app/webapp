// Submission.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Submission = sequelize.define('Submission', {
  assignment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  submission_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  submission_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  submission_updated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Submission;
