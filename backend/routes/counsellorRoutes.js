const express = require('express');
const router = express.Router();
const { 
    getAllCounsellors,
    updateCounsellorStatus,
    getCounsellorStats
} = require('../controllers/counsellorController');
const { protectAdmin } = require('../middlewares/authMiddleware');

// Admin routes for counsellor management
router.route('/admin/all').get(protectAdmin, getAllCounsellors);
router.route('/admin/stats').get(protectAdmin, getCounsellorStats);
router.route('/admin/:id/status').patch(protectAdmin, updateCounsellorStatus);

module.exports = router; 