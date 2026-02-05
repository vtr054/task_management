const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getUserProfile } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', protect, authorize('Admin'), registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);

// Initial Admin creation helper (remove in production or secure it)
// Or use a seed script. For assessment, I might need a public register or hardcoded seed.
// Requirement says "User registration (Admin-only)".
// So how do we get the first Admin? 
// Maybe a seed script or a temporary route. 
// I'll add a temporary public register or seed route if requested.
// For now, adhering to Admin-only.

module.exports = router;
