const express = require('express');
const router = express.Router();
const {
    createHousehold,
    addMemberToHousehold,
    getHouseholdsBySession
} = require('../controllers/householdController');
const { protectCounsellor } = require('../middlewares/authMiddleware');

router.route('/').post(protectCounsellor, createHousehold);
router.route('/:id/members').post(protectCounsellor, addMemberToHousehold);
router.route('/session/:sessionId').get(protectCounsellor, getHouseholdsBySession);

module.exports = router; 