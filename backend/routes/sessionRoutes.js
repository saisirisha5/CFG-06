const express = require('express');
const router = express.Router();
const { 
    createSession,
    getMySessions,
    getSessionById,
    respondToSession 
} = require('../controllers/sessionController');
const { protectAdmin, protectCounsellor } = require('../middlewares/authMiddleware');

router.route('/').post(protectAdmin, createSession);
router.route('/mysessions').get(protectCounsellor, getMySessions);
router.route('/:id').get(protectCounsellor, getSessionById);
router.route('/:id/respond').post(protectCounsellor, respondToSession);

module.exports = router; 