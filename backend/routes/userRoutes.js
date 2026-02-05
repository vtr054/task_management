const express = require('express');
const router = express.Router();
const { getUsers, updateUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// Allow Managers and Admins to view users
router.get('/', authorize('Admin', 'Manager'), getUsers);

// Admin only for modification
router.use(authorize('Admin'));
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
