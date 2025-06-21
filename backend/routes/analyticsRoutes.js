const express = require('express');
const router = express.Router();
const { 
    getOverviewStats,
    getHealthRiskTrends,
    getDashboardAnalytics 
} = require('../controllers/analyticsController');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.route('/overview').get(protectAdmin, getOverviewStats);
router.route('/risk-trends').get(protectAdmin, getHealthRiskTrends);
router.route('/dashboard').get(protectAdmin, getDashboardAnalytics);

module.exports = router; 