const mongoose = require('mongoose');

const counsellorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
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
  profilePic: {
    type: String, // URL string
    required: false, // Optional for now
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: false,
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