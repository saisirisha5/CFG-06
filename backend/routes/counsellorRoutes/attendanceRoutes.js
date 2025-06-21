const express = require('express');
const router = express.Router();
const attendanceController = require('../../controllers/counsellorControllers/geoAttendanceController');
const upload = require('../../middlewares/counsellor/upload');

// Route to handle geo-tagged image attendance
router.post('/geo-upload', upload.single('photo'), attendanceController.uploadGeoTaggedAttendance);

module.exports = router;
//C:\Users\prabh\OneDrive\Desktop\CFG-06\CFG-06\backend\