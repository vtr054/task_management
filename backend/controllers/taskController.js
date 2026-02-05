const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Create task
// @route   POST /api/tasks
// @access  Private/Manager
const createTask = async (req, res) => {
    try {
        const { title, description, status, dueDate, projectId, assignedTo } = req.body;

        // Verify Project ownership or access
        const project = await Project.findByPk(projectId);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        // (Optional: Check if manager owns project)

        const task = await Task.create({
            title,
            description,
            status,
            dueDate,
            projectId,
            assignedTo // assigned user ID
        });

        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get tasks
// @route   GET /api/tasks (query: projectId)
// @access  Private
const getTasks = async (req, res) => {
    try {
        const { projectId } = req.query;
        let where = {};

        if (projectId) where.projectId = projectId;

        // Role based filtering
        if (req.user.role === 'User') {
            where.assignedTo = req.user.id;
        }

        const tasks = await Task.findAll({
            where,
            include: [
                { model: User, as: 'assignee', attributes: ['id', 'name'] },
                { model: Project, as: 'project', attributes: ['id', 'name'] }
            ]
        });

        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update task (Status or Details)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const { title, description, status, dueDate, assignedTo } = req.body;

        // User can only update status
        if (req.user.role === 'User') {
            if (task.assignedTo !== req.user.id) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            task.status = status || task.status;
        } else {
            // Manager/Admin can update everything
            task.title = title || task.title;
            task.description = description || task.description;
            task.status = status || task.status;
            task.dueDate = dueDate || task.dueDate;
            task.assignedTo = assignedTo || task.assignedTo;
        }

        await task.save();
        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Manager
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        await task.destroy();
        res.json({ message: 'Task removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
};
