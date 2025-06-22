const mongoose = require('mongoose');

const regionalDataSchema = new mongoose.Schema({
  demographics: { type: String, required: true },
  nutritionStatus: { type: String, required: true },
  healthTrends: { type: String, required: true },
  serviceGaps: { type: String, required: true },
  behavioralData: { type: String, required: true },
  educationLevels: { type: String, required: true },
  languageTechAccess: { type: String, required: true },
});

const counsellingSessionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  scheduledDateTime: { type: Date, required: true },
  durationMinutes: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'Rejected', 'Completed'],
    default: 'Pending',
  },
  assignedCounsellor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Counsellor',
    default: null,
  },
  rejectedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Counsellor',
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  regionalData: { type: regionalDataSchema, required: true },
}, { timestamps: true });

counsellingSessionSchema.index({ location: '2dsphere' });

const CounsellingSession = mongoose.model('CounsellingSession', counsellingSessionSchema);

module.exports = CounsellingSession; 