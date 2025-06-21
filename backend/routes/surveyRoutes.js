const express = require('express');
const router = express.Router();
const { submitSurvey } = require('../controllers/surveyController');
const { protectCounsellor } = require('../middlewares/authMiddleware');

router.route('/submit/:householdId').post(protectCounsellor, submitSurvey);

module.exports = router; 