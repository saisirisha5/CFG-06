const Household = require('../models/Household');
const CounsellingSession = require('../models/CounsellingSession');

// @desc    Create a new household for a session
// @route   POST /api/households
// @access  Private/Counsellor
const createHousehold = async (req, res) => {
    try {
        const { name, sessionId } = req.body;
        const counsellorId = req.user._id;

        // 1. Validate that the session exists and is assigned to this counsellor
        const session = await CounsellingSession.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: 'Counselling session not found.' });
        }
        
        // **FIX**: Check if a counsellor is assigned, THEN check if it's the correct one.
        if (!session.assignedCounsellor || session.assignedCounsellor.toString() !== counsellorId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to add households to this session. The session might be pending or assigned to another counsellor.' });
        }

        // 2. Create and save the new household
        const newHousehold = new Household({
            name,
            counsellingSession: sessionId,
            counsellor: counsellorId,
        });

        const savedHousehold = await newHousehold.save();
        res.status(201).json(savedHousehold);

    } catch (error) {
        res.status(500).json({ message: 'Error creating household', error: error.message });
    }
};

// @desc    Add a member to a household
// @route   POST /api/households/:id/members
// @access  Private/Counsellor
const addMemberToHousehold = async (req, res) => {
    try {
        const { name, age, gender } = req.body;
        const householdId = req.params.id;
        const counsellorId = req.user._id;

        // 1. Find the household
        const household = await Household.findById(householdId);
        if (!household) {
            return res.status(404).json({ message: 'Household not found.' });
        }
        
        // 2. Validate that the counsellor owns this household
        if (household.counsellor.toString() !== counsellorId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to add members to this household.' });
        }

        // 3. Add the new member and save
        household.members.push({ name, age, gender });
        const updatedHousehold = await household.save();
        
        res.status(201).json(updatedHousehold);

    } catch (error) {
        res.status(500).json({ message: 'Error adding member to household', error: error.message });
    }
};

module.exports = {
    createHousehold,
    addMemberToHousehold,
}; 