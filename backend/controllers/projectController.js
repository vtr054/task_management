const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Manager, Admin
const createProject = async (req, res) => {
    try {
        const { name, description, status } = req.body;

        const project = await Project.create({
            name,
            description,
            status,
            managerId: req.user.id
        });

        res.status(201).json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all projects (Admin triggers this), or Manager's projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
    try {
        let projects;
        if (req.user.role === 'Admin') {
            projects = await Project.findAll({
                include: [{ model: User, as: 'manager', attributes: ['id', 'name'] }]
            });
        } else if (req.user.role === 'Manager') {
            projects = await Project.findAll({
                where: { managerId: req.user.id },
                include: [{ model: User, as: 'manager', attributes: ['id', 'name'] }]
            });
        } else {
            // User: View assigned projects (via ProjectMembers)
            // Need to implement ProjectMember logic
            // For now, return empty or implement simple 'get assigned' later
            return res.json([]);
        }
        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Manager, Admin
const updateProject = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check ownership
        if (req.user.role !== 'Admin' && project.managerId !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { name, description, status } = req.body;
        project.name = name || project.name;
        project.description = description || project.description;
        project.status = status || project.status;

        await project.save();
        res.json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Manager, Admin
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (req.user.role !== 'Admin' && project.managerId !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await project.destroy();
        res.json({ message: 'Project removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id, {
            include: [{ model: User, as: 'manager', attributes: ['id', 'name'] }]
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Access control: Admin, Manager (owner), User (assigned - todo)
        if (req.user.role === 'Manager' && project.managerId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
};
