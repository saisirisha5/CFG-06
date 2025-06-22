const express = require('express');
const router = express.Router();
const { 
    getOverviewStats,
    getSessionAnalytics,
    getHouseholdAnalytics,
    generateSessionReport,
    generateFamilyReport,
    getHealthRiskTrends,
    getDashboardAnalytics 
} = require('../controllers/analyticsController');
const { protectAdmin } = require('../middlewares/authMiddleware');

// Overview and dashboard routes
router.route('/overview').get(protectAdmin, getOverviewStats);
router.route('/dashboard').get(protectAdmin, getDashboardAnalytics);

// Session analytics routes
router.route('/sessions').get(protectAdmin, getSessionAnalytics);

// Household analytics routes
router.route('/households').get(protectAdmin, getHouseholdAnalytics);

// Report generation routes
router.route('/session-report/:sessionId').get(protectAdmin, generateSessionReport);
router.route('/family-report/:householdId').get(protectAdmin, generateFamilyReport);

// Health trends routes
router.route('/risk-trends').get(protectAdmin, getHealthRiskTrends);

module.exports = router; 