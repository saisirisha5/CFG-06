const CounsellingSession = require('../models/CounsellingSession');
const Counsellor = require('../models/Counsellor');
const Household = require('../models/Household');
const SurveyResponse = require('../models/SurveyResponse');

// @desc    Get overview stats for the admin dashboard
// @route   GET /api/analytics/overview
// @access  Private/Admin
const getOverviewStats = async (req, res) => {
    try {
        const totalSessions = await CounsellingSession.countDocuments();
        const pendingSessions = await CounsellingSession.countDocuments({ status: 'Pending' });
        const completedSessions = await CounsellingSession.countDocuments({ status: 'Completed' });

        const totalCounsellors = await Counsellor.countDocuments();
        const totalHouseholds = await Household.countDocuments();
        const totalSurveyResponses = await SurveyResponse.countDocuments();

        res.json({
            sessions: {
                total: totalSessions,
                pending: pendingSessions,
                completed: completedSessions,
            },
            counsellors: {
                total: totalCounsellors,
            },
            outreach: {
                totalHouseholds: totalHouseholds,
                totalSurveyResponses: totalSurveyResponses,
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching overview stats", error: error.message });
    }
};

// @desc    Get aggregated health risk trends from all households
// @route   GET /api/analytics/risk-trends
// @access  Private/Admin
const getHealthRiskTrends = async (req, res) => {
    try {
        const riskTrends = await Household.aggregate([
            // Stage 1: Filter out households that haven't been analyzed yet
            { $match: { "healthAnalysis.keyRiskFactors": { $exists: true, $ne: [] } } },

            // Stage 2: Deconstruct the keyRiskFactors array into a stream of documents
            { $unwind: "$healthAnalysis.keyRiskFactors" },

            // Stage 3: Group documents by the risk factor and count occurrences
            {
                $group: {
                    _id: "$healthAnalysis.keyRiskFactors",
                    count: { $sum: 1 }
                }
            },

            // Stage 4: Sort by the most common risks first
            { $sort: { count: -1 } },
            
            // Stage 5: Rename the '_id' field to be more descriptive
            {
                $project: {
                    _id: 0,
                    riskFactor: "$_id",
                    count: 1
                }
            }
        ]);

        res.json(riskTrends);

    } catch (error) {
        res.status(500).json({ message: "Error fetching health risk trends", error: error.message });
    }
};

// @desc    Get all aggregated data for the main dashboard
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
const getDashboardAnalytics = async (req, res) => {
    try {
        const [riskTrends, positiveTrends, counsellingTrends] = await Promise.all([
            // Aggregation 1: Top Risk Factors
            Household.aggregate([
                { $match: { "healthAnalysis.keyRiskFactors": { $exists: true, $ne: [] } } },
                { $unwind: "$healthAnalysis.keyRiskFactors" },
                { $group: { _id: "$healthAnalysis.keyRiskFactors", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }, // Get top 10
                { $project: { _id: 0, item: "$_id", count: 1, type: "risk" } }
            ]),
            // Aggregation 2: Top Positive Indicators
            Household.aggregate([
                { $match: { "healthAnalysis.positiveIndicators": { $exists: true, $ne: [] } } },
                { $unwind: "$healthAnalysis.positiveIndicators" },
                { $group: { _id: "$healthAnalysis.positiveIndicators", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 },
                { $project: { _id: 0, item: "$_id", count: 1, type: "positive" } }
            ]),
            // Aggregation 3: Top Counselling Focus Areas
            Household.aggregate([
                { $match: { "healthAnalysis.counsellingFocus": { $exists: true, $ne: [] } } },
                { $unwind: "$healthAnalysis.counsellingFocus" },
                { $group: { _id: "$healthAnalysis.counsellingFocus", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 },
                { $project: { _id: 0, item: "$_id", count: 1, type: "focus" } }
            ])
        ]);

        res.json({
            riskTrends,
            positiveTrends,
            counsellingTrends
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching dashboard analytics", error: error.message });
    }
};

module.exports = {
    getOverviewStats,
    getHealthRiskTrends,
    getDashboardAnalytics,
}; 