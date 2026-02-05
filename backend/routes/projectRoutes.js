const express = require('express');
const router = express.Router();
const { createProject, getProjects, getProjectById, updateProject, deleteProject } = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(getProjects)
    .post(authorize('Manager', 'Admin'), createProject);

router.route('/:id')
    .get(getProjectById)
    .put(authorize('Manager', 'Admin'), updateProject)
    .delete(authorize('Manager', 'Admin'), deleteProject);

module.exports = router;
