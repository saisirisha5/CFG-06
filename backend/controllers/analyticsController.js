const CounsellingSession = require('../models/CounsellingSession');
const Counsellor = require('../models/Counsellor');
const Household = require('../models/Household');
const SurveyResponse = require('../models/SurveyResponse');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Get overview stats for the admin dashboard
// @route   GET /api/analytics/overview
// @access  Private/Admin
const getOverviewStats = async (req, res) => {
    try {
        const totalSessions = await CounsellingSession.countDocuments();
        const pendingSessions = await CounsellingSession.countDocuments({ status: 'Pending' });
        const completedSessions = await CounsellingSession.countDocuments({ status: 'Completed' });
        const assignedSessions = await CounsellingSession.countDocuments({ status: 'Assigned' });

        const totalCounsellors = await Counsellor.countDocuments({ status: 'Approved' });
        const totalHouseholds = await Household.countDocuments();
        const totalSurveyResponses = await SurveyResponse.countDocuments();

        // Calculate completion rate
        const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

        res.json({
            sessions: {
                total: totalSessions,
                pending: pendingSessions,
                completed: completedSessions,
                assigned: assignedSessions,
                completionRate
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

// @desc    Get session analytics with trends
// @route   GET /api/analytics/sessions
// @access  Private/Admin
const getSessionAnalytics = async (req, res) => {
    try {
        // Monthly session trends
        const monthlyTrends = await CounsellingSession.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 },
                    completed: {
                        $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] }
                    }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            {
                $project: {
                    _id: 0,
                    period: {
                        $concat: [
                            { $toString: "$_id.year" },
                            "-",
                            { $toString: "$_id.month" }
                        ]
                    },
                    total: "$count",
                    completed: "$completed"
                }
            }
        ]);

        // Status distribution
        const statusDistribution = await CounsellingSession.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Counsellor performance
        const counsellorPerformance = await CounsellingSession.aggregate([
            {
                $lookup: {
                    from: "counsellors",
                    localField: "assignedCounsellor",
                    foreignField: "_id",
                    as: "counsellor"
                }
            },
            { $unwind: "$counsellor" },
            {
                $group: {
                    _id: "$assignedCounsellor",
                    counsellorName: { $first: "$counsellor.name" },
                    totalSessions: { $sum: 1 },
                    completedSessions: {
                        $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    counsellorId: "$_id",
                    counsellorName: "$counsellorName",
                    totalSessions: "$totalSessions",
                    completedSessions: "$completedSessions",
                    completionRate: {
                        $round: [
                            { $multiply: [{ $divide: ["$completedSessions", "$totalSessions"] }, 100] },
                            2
                        ]
                    }
                }
            },
            { $sort: { completionRate: -1 } }
        ]);

        res.json({
            monthlyTrends,
            statusDistribution,
            counsellorPerformance
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching session analytics", error: error.message });
    }
};

// @desc    Get household and health analytics
// @route   GET /api/analytics/households
// @access  Private/Admin
const getHouseholdAnalytics = async (req, res) => {
    try {
        // Household composition analysis
        const householdComposition = await Household.aggregate([
            {
                $project: {
                    memberCount: { $size: "$members" },
                    hasChildren: {
                        $gt: [
                            { $size: { $filter: { input: "$members", cond: { $lt: ["$$this.age", 18] } } } },
                            0
                        ]
                    },
                    hasElderly: {
                        $gt: [
                            { $size: { $filter: { input: "$members", cond: { $gt: ["$$this.age", 60] } } } },
                            0
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    avgMemberCount: { $avg: "$memberCount" },
                    householdsWithChildren: { $sum: { $cond: ["$hasChildren", 1, 0] } },
                    householdsWithElderly: { $sum: { $cond: ["$hasElderly", 1, 0] } }
                }
            }
        ]);

        // Age distribution
        const ageDistribution = await Household.aggregate([
            { $unwind: "$members" },
            {
                $group: {
                    _id: {
                        $switch: {
                            branches: [
                                { case: { $lt: ["$members.age", 18] }, then: "Children (0-17)" },
                                { case: { $lt: ["$members.age", 30] }, then: "Young Adults (18-29)" },
                                { case: { $lt: ["$members.age", 50] }, then: "Adults (30-49)" },
                                { case: { $lt: ["$members.age", 65] }, then: "Middle-aged (50-64)" }
                            ],
                            default: "Elderly (65+)"
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Health risk factors analysis
        const healthRiskFactors = await Household.aggregate([
            { $match: { "healthAnalysis.keyRiskFactors": { $exists: true, $ne: [] } } },
            { $unwind: "$healthAnalysis.keyRiskFactors" },
            {
                $group: {
                    _id: "$healthAnalysis.keyRiskFactors",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        res.json({
            householdComposition: householdComposition[0] || {},
            ageDistribution,
            healthRiskFactors
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching household analytics", error: error.message });
    }
};

// @desc    Generate comprehensive session report using Gemini
// @route   GET /api/analytics/session-report/:sessionId
// @access  Private/Admin
const generateSessionReport = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = await CounsellingSession.findById(sessionId)
            .populate('assignedCounsellor', 'name email')
            .populate('createdBy', 'name email');

        const households = await Household.find({ counsellingSession: sessionId })
            .populate('members');

        const surveyResponses = await SurveyResponse.find({ counsellingSession: sessionId });

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        // Generate AI report using Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are a senior public health analyst. Generate a comprehensive session report in JSON format for a counselling session.

            Session Details:
            - Name: ${session.name}
            - Location: ${session.address}
            - Scheduled: ${session.scheduledDateTime}
            - Status: ${session.status}
            - Regional Data: ${JSON.stringify(session.regionalData)}

            Household Data:
            - Total Households: ${households.length}
            - Total Members: ${households.reduce((sum, h) => sum + h.members.length, 0)}
            - Survey Responses: ${surveyResponses.length}

            Household Details: ${JSON.stringify(households.map(h => ({
                memberCount: h.members.length,
                healthAnalysis: h.healthAnalysis
            })))}

            Generate a JSON report with the following structure:
            {
                "executiveSummary": "Brief overview of the session",
                "keyFindings": ["Array of key findings"],
                "healthTrends": ["Array of health trends identified"],
                "recommendations": ["Array of recommendations"],
                "statistics": {
                    "totalHouseholds": number,
                    "totalMembers": number,
                    "avgMembersPerHousehold": number,
                    "completionRate": number
                },
                "riskAssessment": {
                    "highRiskHouseholds": number,
                    "commonRiskFactors": ["Array of common risks"],
                    "priorityAreas": ["Array of priority areas"]
                }
            }

            Provide ONLY the JSON object, no additional text.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const aiReport = JSON.parse(cleanedJson);

        res.json({
            session,
            households,
            surveyResponses,
            aiReport
        });

    } catch (error) {
        console.error('Error generating session report:', error);
        res.status(500).json({ message: "Error generating session report", error: error.message });
    }
};

// @desc    Generate family report using Gemini
// @route   GET /api/analytics/family-report/:householdId
// @access  Private/Admin
const generateFamilyReport = async (req, res) => {
    try {
        const { householdId } = req.params;

        const household = await Household.findById(householdId)
            .populate('members')
            .populate('counsellingSession')
            .populate('counsellor', 'name email');

        const surveyResponses = await SurveyResponse.find({ household: householdId });

        if (!household) {
            return res.status(404).json({ message: "Household not found" });
        }

        // Generate AI report using Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are a family health counsellor. Generate a detailed family health report in JSON format.

            Family Details:
            - Members: ${JSON.stringify(household.members)}
            - Address: ${household.address}
            - Health Analysis: ${JSON.stringify(household.healthAnalysis)}
            - Survey Responses: ${JSON.stringify(surveyResponses)}

            Generate a JSON report with the following structure:
            {
                "familyProfile": "Brief family overview",
                "healthAssessment": {
                    "overallHealth": "Overall health status",
                    "riskFactors": ["Array of risk factors"],
                    "positivePractices": ["Array of positive practices"]
                },
                "recommendations": {
                    "immediate": ["Immediate actions needed"],
                    "shortTerm": ["Short-term recommendations"],
                    "longTerm": ["Long-term recommendations"]
                },
                "counsellingNotes": "Specific counselling guidance",
                "followUpPlan": "Follow-up action plan"
            }

            Provide ONLY the JSON object, no additional text.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const aiReport = JSON.parse(cleanedJson);

        res.json({
            household,
            surveyResponses,
            aiReport
        });

    } catch (error) {
        console.error('Error generating family report:', error);
        res.status(500).json({ message: "Error generating family report", error: error.message });
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
    getSessionAnalytics,
    getHouseholdAnalytics,
    generateSessionReport,
    generateFamilyReport,
    getHealthRiskTrends,
    getDashboardAnalytics,
}; 