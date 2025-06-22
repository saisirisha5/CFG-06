const Counsellor = require('../models/Counsellor');

// @desc    Get all counsellors for admin
// @route   GET /api/counsellors/admin/all
// @access  Private/Admin
const getAllCounsellors = async (req, res) => {
    try {
        const counsellors = await Counsellor.find()
            .select('-password') // Exclude password from response
            .sort({ createdAt: -1 }); // Most recent first

        res.json({
            success: true,
            count: counsellors.length,
            data: counsellors
        });

    } catch (error) {
        console.error('Error fetching counsellors:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching counsellors', 
            error: error.message 
        });
    }
};

// @desc    Update counsellor status (approve/reject)
// @route   PATCH /api/counsellors/admin/:id/status
// @access  Private/Admin
const updateCounsellorStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        console.log('Updating counsellor status:', { id, status, body: req.body });

        // Validate status
        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status must be either "Approved" or "Rejected"'
            });
        }

        const counsellor = await Counsellor.findById(id);
        
        if (!counsellor) {
            return res.status(404).json({
                success: false,
                message: 'Counsellor not found'
            });
        }

        console.log('Found counsellor:', { 
            id: counsellor._id, 
            currentStatus: counsellor.status, 
            newStatus: status 
        });

        // Update status
        counsellor.status = status;
        
        // Save with validation disabled to handle missing fields
        await counsellor.save({ validateBeforeSave: false });

        console.log('Status updated successfully');

        // Return updated counsellor without password
        const updatedCounsellor = await Counsellor.findById(id).select('-password');

        res.json({
            success: true,
            message: `Counsellor ${status.toLowerCase()} successfully`,
            data: updatedCounsellor
        });

    } catch (error) {
        console.error('Error updating counsellor status:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        res.status(500).json({ 
            success: false,
            message: 'Error updating counsellor status', 
            error: error.message 
        });
    }
};

// @desc    Get counsellor statistics for admin
// @route   GET /api/counsellors/admin/stats
// @access  Private/Admin
const getCounsellorStats = async (req, res) => {
    try {
        const totalCounsellors = await Counsellor.countDocuments();
        const pendingCounsellors = await Counsellor.countDocuments({ status: 'Pending' });
        const approvedCounsellors = await Counsellor.countDocuments({ status: 'Approved' });
        const rejectedCounsellors = await Counsellor.countDocuments({ status: 'Rejected' });

        res.json({
            success: true,
            data: {
                total: totalCounsellors,
                pending: pendingCounsellors,
                approved: approvedCounsellors,
                rejected: rejectedCounsellors
            }
        });

    } catch (error) {
        console.error('Error fetching counsellor stats:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching counsellor statistics', 
            error: error.message 
        });
    }
};

module.exports = {
    getAllCounsellors,
    updateCounsellorStatus,
    getCounsellorStats
}; 