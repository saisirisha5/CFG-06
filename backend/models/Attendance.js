const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  counsellorId: 
  { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Counsellor', 
    required: true 
},
  imageUrl: 
  { 
    type: String, 
    required: true 
  },
  latitude: 
  {
     type: Number, 
     required: true 
    },
  longitude: 
  { 
    type: Number,
     required: true
 },
  timeIn: 
  { 
    type: Date, 
    required: true 
},
  timeOut: 
  { 
    type: Date 
  },
  locationVerified: 
  {
     type: Boolean,
      default: true 
    } 
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
