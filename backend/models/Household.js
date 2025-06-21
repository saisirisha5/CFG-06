const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  profilePhoto: { type: String, required: false},
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
}, { _id: true }); // Ensure members get their own _id

const householdSchema = new mongoose.Schema({
  name: { type: String, required: true },
  counsellingSession: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CounsellingSession',
    required: true,
  },
  counsellor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Counsellor',
    required: true,
  },
  members: [memberSchema],
}, { timestamps: true });

const Household = mongoose.model('Household', householdSchema);

module.exports = Household; 