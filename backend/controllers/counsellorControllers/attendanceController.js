const Attendance = require('../models/Attendance');
const path = require('path');

exports.syncAttendance = async (req, res) => {
  try {
    const { counsellorId, latitude, longitude, timeIn } = req.body;

    if (!req.file) return res.status(400).json({ message: 'Photo is required' });

    const imageUrl = `/static/images/${req.file.filename}`;

    const attendance = new Attendance({
      counsellorId,
      imageUrl,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      timeIn: new Date(timeIn),
    });

    await attendance.save();
    res.status(201).json({ message: 'Attendance synced successfully!', data: attendance });

  } catch (err) {
    console.error('Sync Error:', err);
    res.status(500).json({ message: 'Server error while syncing' });
  }
};
