const Household = require('../models/Household');
const SurveyResponse = require('../models/SurveyResponse');
const CounsellingSession = require('../models/CounsellingSession');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateHealthAnalysis = async (household, responses, session) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are a senior data analyst for a public health initiative in India.
            Analyze the following household survey data and generate a "Health Heatmap" JSON object.

            The JSON object must contain three keys: 
            1. "keyRiskFactors": An array of strings identifying potential health risks.
            2. "positiveIndicators": An array of strings identifying positive health practices.
            3. "counsellingFocus": An array of strings with targeted advice for the counsellor.

            Contextual Data:
            - Original Session Goal (Regional Data): ${JSON.stringify(session.regionalData)}
            - Household Composition: ${JSON.stringify(household.members)}
            - Survey Answers Provided by Family: ${JSON.stringify(responses)}

            Based on all the above data, provide ONLY the JSON object for the Health Heatmap.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedJson);

    } catch (error) {
        console.error("Error generating health analysis with Gemini:", error);
        return {
            keyRiskFactors: ["Error during Gemini analysis."],
            positiveIndicators: [],
            counsellingFocus: ["Could not generate AI analysis. Please proceed with standard counselling based on raw answers."]
        };
    }
};

// @desc    Submit all survey answers for a household
// @route   POST /api/surveys/submit/:householdId
// @access  Private/Counsellor
const submitSurvey = async (req, res) => {
    try {
        const { responses } = req.body; // Array of { question, answer, memberId (optional) }
        const { householdId } = req.params;
        const counsellorId = req.user._id;

        const household = await Household.findById(householdId);
        if (!household || household.counsellor.toString() !== counsellorId.toString()) {
            return res.status(403).json({ message: "Forbidden: Household not found or not assigned to you." });
        }

        const session = await CounsellingSession.findById(household.counsellingSession);

        // 1. Save the raw survey responses
        const responseDocs = responses.map(r => ({
            ...r,
            household: householdId,
            counsellingSession: household.counsellingSession
        }));
        await SurveyResponse.insertMany(responseDocs);

        // 2. Generate the AI-powered analysis
        const analysis = await generateHealthAnalysis(household, responses, session);
        
        // 3. Save the analysis to the household
        household.healthAnalysis = analysis;
        const updatedHousehold = await household.save();

        res.status(200).json({ message: "Survey submitted and analyzed successfully.", household: updatedHousehold });

    } catch (error) {
        res.status(500).json({ message: "Error submitting survey.", error: error.message });
    }
};

module.exports = { submitSurvey }; 