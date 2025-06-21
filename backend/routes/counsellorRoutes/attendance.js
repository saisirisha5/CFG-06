const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { syncAttendance } = require('../controllers/attendanceController'); // ✅ updated import

router.post('/sync', upload.single('photo'), syncAttendance);

module.exports = router;
