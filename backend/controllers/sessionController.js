const CounsellingSession = require('../models/CounsellingSession');
const Questionnaire = require('../models/Questionnaire');
const Counsellor = require('../models/Counsellor');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- New Helper Function to Generate Questions ---
const generateQuestionsWithGemini = async (regionalData) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

        const prompt = `
            You are an expert in public health and community medicine in India. 
            Based on the following regional data, generate a structured JSON array of 5 survey questions.
            The questions should be a mix of 'MCQ', 'YesNo', and 'Rating' (scale 1-5).
            The JSON output MUST be a valid array of objects, with no extra text or explanations.
            Each object in the array must have "questionText", "questionType", and if it's an "MCQ", an "options" array.

            Regional Data:
            - Demographics: ${regionalData.demographics}
            - Nutrition Status: ${regionalData.nutritionStatus}
            - Health Trends: ${regionalData.healthTrends}
            - Service Gaps: ${regionalData.serviceGaps}
            - Behavioral Data: ${regionalData.behavioralData}
            - Education Levels: ${regionalData.educationLevels}
            - Language/Tech Access: ${regionalData.languageTechAccess}

            Provide ONLY the JSON array. Example format:
            [
                { "questionText": "Question 1?", "questionType": "MCQ", "options": ["A", "B", "C"] },
                { "questionText": "Question 2?", "questionType": "YesNo" }
            ]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Clean the response to ensure it's valid JSON
        const cleanedJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedJson);

    } catch (error) {
        console.error("Error generating questions with Gemini:", error);
        // Fallback to default questions if the API fails
        return [
            { questionText: "API Error: Could not generate dynamic questions. Do you have access to clean drinking water?", questionType: "YesNo" }
        ];
    }
};

// Helper function to find and "notify" the nearest counsellor
const findAndNotifyNearestCounsellor = async (session) => {
    const nearestCounsellor = await Counsellor.findOne({
        location: {
            $near: {
                $geometry: session.location,
                $maxDistance: 50000, // 50km radius, can be configured
            },
        },
        _id: { $nin: session.rejectedBy } // Exclude counsellors who have rejected
    });

    if (nearestCounsellor) {
        console.log(`--- SIMULATING NOTIFICATION ---`);
        console.log(`Notifying counsellor ${nearestCounsellor.email} for session ${session.name}`);
        console.log(`To accept/reject, they would call: POST /api/sessions/${session._id}/respond`);
        console.log(`-----------------------------`);
        // In a real app, this would trigger a WhatsApp/Email notification
    } else {
        console.log(`No available counsellors found for session ${session.name}`);
        // Optionally, update session status to 'Unassigned' or similar
    }
};

// @desc    Create a new counselling session
// @route   POST /api/sessions
// @access  Private/Admin
const createSession = async (req, res) => {
  try {
    const {
      name,
      address,
      longitude,
      latitude,
      scheduledDateTime,
      durationMinutes,
      regionalData
    } = req.body;

    // TODO: Add more robust validation here later

    const newSession = new CounsellingSession({
      name,
      address,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      scheduledDateTime,
      durationMinutes,
      regionalData,
      createdBy: req.user._id, // from protectAdmin middleware
    });
    
    const createdSession = await newSession.save();

    // --- Generate Questions using Gemini ---
    const generatedQuestions = await generateQuestionsWithGemini(createdSession.regionalData);

    // Create the corresponding questionnaire with dynamic questions
    const newQuestionnaire = new Questionnaire({
        session: createdSession._id,
        questions: generatedQuestions // Use the questions from Gemini
    });

    await newQuestionnaire.save();

    // Find and notify the first nearest counsellor
    await findAndNotifyNearestCounsellor(createdSession);

    res.status(201).json(createdSession);
  } catch (error) {
    res.status(400).json({ message: 'Error creating session', error: error.message });
  }
};

// @desc    Get sessions assigned to the logged-in counsellor
// @route   GET /api/sessions/mysessions
// @access  Private/Counsellor
const getMySessions = async (req, res) => {
  try {
    const sessions = await CounsellingSession.find({ assignedCounsellor: req.user._id });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions', error: error.message });
  }
};

// @desc    Get a single session by ID
// @route   GET /api/sessions/:id
// @access  Private/Counsellor
const getSessionById = async (req, res) => {
  try {
    const session = await CounsellingSession.findById(req.params.id);
    if (!session) {
        return res.status(404).json({ message: 'Session not found' });
    }
    
    const questionnaire = await Questionnaire.findOne({ session: session._id });

    // Optional: Check if counsellor is assigned to this session
    // if (session.assignedCounsellor.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ message: 'Not authorized for this session' });
    // }
    
    res.json({ session, questions: questionnaire ? questionnaire.questions : [] });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching session details', error: error.message });
  }
};

// @desc    Respond to a session invitation
// @route   POST /api/sessions/:id/respond
// @access  Private/Counsellor
const respondToSession = async (req, res) => {
    try {
        const { response } = req.body; // "accept" or "reject"
        const session = await CounsellingSession.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        
        if (session.status !== 'Pending') {
            return res.status(400).json({ message: `Session is already ${session.status}`});
        }

        if (response === 'accept') {
            session.assignedCounsellor = req.user._id;
            session.status = 'Assigned';
            await session.save();
            res.json({ message: 'Session accepted successfully', session });
        } else if (response === 'reject') {
            session.rejectedBy.push(req.user._id);
            await session.save();
            
            // Find the next available counsellor
            await findAndNotifyNearestCounsellor(session);

            res.json({ message: 'Session rejected. Notifying next available counsellor.' });
        } else {
            res.status(400).json({ message: 'Invalid response. Must be "accept" or "reject".' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error responding to session', error: error.message });
    }
};

module.exports = {
  createSession,
  getMySessions,
  getSessionById,
  respondToSession
}; 