const CounsellingSession = require('../models/CounsellingSession');
const Questionnaire = require('../models/Questionnaire');
const Counsellor = require('../models/Counsellor');

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

    // Create the corresponding questionnaire
    const newQuestionnaire = new Questionnaire({
        session: createdSession._id,
        questions: [
            {
                questionText: "What is the primary source of Vitamin A?",
                questionType: "MCQ",
                options: ["Carrots", "Rice", "Milk", "Sugar"]
            },
            {
                questionText: "Should drinking water be boiled?",
                questionType: "YesNo"
            }
        ]
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

    if (session) {
      // Optional: Check if counsellor is assigned to this session
      // if (session.assignedCounsellor.toString() !== req.user._id.toString()) {
      //   return res.status(403).json({ message: 'Not authorized for this session' });
      // }
      res.json(session);
    } else {
      res.status(404).json({ message: 'Session not found' });
    }
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