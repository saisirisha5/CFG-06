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
  }
}, { timestamps: true });

const Counsellor = mongoose.model('Counsellor', counsellorSchema);

module.exports = Counsellor; 