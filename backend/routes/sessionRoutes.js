const express = require('express');
const router = express.Router();
const { 
    createSession,
    getMySessions,
    getSessionById,
    respondToSession,
    getAllSessionsForAdmin,
    getSessionByIdForAdmin
} = require('../controllers/sessionController');
const { protectAdmin, protectCounsellor } = require('../middlewares/authMiddleware');

// Admin routes
router.route('/').post(protectAdmin, createSession);
router.route('/admin/all').get(protectAdmin, getAllSessionsForAdmin);
router.route('/admin/:id').get(protectAdmin, getSessionByIdForAdmin);

// Counsellor routes
router.route('/mysessions').get(protectCounsellor, getMySessions);
router.route('/:id').get(protectCounsellor, getSessionById);
router.route('/:id/respond').post(protectCounsellor, respondToSession);

module.exports = router; 