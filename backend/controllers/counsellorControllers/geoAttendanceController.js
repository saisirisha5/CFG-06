const fs = require('fs');
const path = require('path');
const exif = require('exif-parser');
const Attendance = require('../../models/Attendance');
const CounsellingSession = require('../../models/CounsellingSession');

function getDistanceInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

exports.uploadGeoTaggedAttendance = async (req, res) => {
  try {
    const { counsellorId } = req.body;
    const filePath = path.join(__dirname, '..','..', 'static/images', req.file.filename);
    const buffer = fs.readFileSync(filePath);
    const parser = exif.create(buffer);
    const result = parser.parse();

    const lat = result.tags.GPSLatitude;
    const lon = result.tags.GPSLongitude;

    if (!lat || !lon) {
      return res.status(400).json({ message: 'No GPS data found in image' });
    }

    const now = new Date();

    const session = await CounsellingSession.findOne({
      counsellorId,
      'slot.startTime': { $lte: now },
      'slot.endTime': { $gte: now }
    });

    let locationVerified = false;
    if (session) {
      const dist = getDistanceInKm(lat, lon, session.location.latitude, session.location.longitude);
      locationVerified = dist <= 1; // within 100m
    }

    const attendance = await Attendance.create({
      counsellorId,
      imageUrl: `/static/images/${req.file.filename}`,
      latitude: lat,
      longitude: lon,
      timeIn: now,
      locationVerified
    });

    res.status(200).json({
      message: 'Attendance marked successfully',
      attendance
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during geo-tag attendance' });
  }
};

exports.getAllAttendances = async (req, res) => {
  try {
    const attendances = await Attendance.find()
      .sort({ timeIn: -1 }) // Most recent first
      .limit(100); // Limit to prevent overwhelming response

    res.status(200).json({
      message: 'Attendances retrieved successfully',
      attendances
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching attendances' });
  }
};

exports.getAttendancesByCounsellor = async (req, res) => {
  try {
    const { counsellorId } = req.params;
    
    const attendances = await Attendance.find({ counsellorId })
      .sort({ timeIn: -1 });

    res.status(200).json({
      message: 'Attendances retrieved successfully',
      attendances
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching attendances' });
  }
};
