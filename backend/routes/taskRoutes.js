const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(getTasks)
    .post(authorize('Manager', 'Admin'), createTask);

router.route('/:id')
    .put(updateTask) // User can update too (status)
    .delete(authorize('Manager', 'Admin'), deleteTask);

module.exports = router;
