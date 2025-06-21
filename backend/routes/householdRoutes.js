const express = require('express');
const router = express.Router();
const {
    createHousehold,
    addMemberToHousehold
} = require('../controllers/householdController');
const { protectCounsellor } = require('../middlewares/authMiddleware');

router.route('/').post(protectCounsellor, createHousehold);
router.route('/:id/members').post(protectCounsellor, addMemberToHousehold);

module.exports = router; 