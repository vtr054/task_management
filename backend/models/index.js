const User = require('./User');
const Project = require('./Project');
const Task = require('./Task');

// Relationships

// User - Project (Manager)
User.hasMany(Project, { foreignKey: 'managerId', as: 'managedProjects' });
Project.belongsTo(User, { foreignKey: 'managerId', as: 'manager' });

// Project - Task
Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks' });
Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// User - Task (Assignment)
User.hasMany(Task, { foreignKey: 'assignedTo', as: 'assignedTasks' });
Task.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignee' });

// Project Members (Many-to-Many)
// A User can be a member of many Projects, and a Project can have many Users
// We need a join table.
const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const ProjectMember = sequelize.define('ProjectMember', {}, { timestamps: false });

User.belongsToMany(Project, { through: ProjectMember, as: 'projects' });
Project.belongsToMany(User, { through: ProjectMember, as: 'members' });

module.exports = {
    User,
    Project,
    Task,
    ProjectMember
};
