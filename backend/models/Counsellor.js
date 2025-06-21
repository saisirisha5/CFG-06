const mongoose = require('mongoose');

const counsellorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: false, // Can be made required later
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: false,
    }
  }
}, { timestamps: true });

counsellorSchema.index({ location: '2dsphere' });

const Counsellor = mongoose.model('Counsellor', counsellorSchema);

module.exports = Counsellor; 