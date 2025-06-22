const express = require('express');
const router = express.Router();
const attendanceController = require('../../controllers/counsellorControllers/geoAttendanceController');
const upload = require('../../middlewares/counsellor/upload');

// Route to handle geo-tagged image attendance
router.post('/geo-upload', upload.single('photo'), attendanceController.uploadGeoTaggedAttendance);

// Route to get all attendance records
router.get('/', attendanceController.getAllAttendances);

// Route to get attendance records by counsellor ID
router.get('/counsellor/:counsellorId', attendanceController.getAttendancesByCounsellor);

module.exports = router;