const mongoose = require('mongoose');

const surveyResponseSchema = new mongoose.Schema({
  household: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Household',
    required: true,
  },
  member: { // Optional: if the question is specific to one member
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Household.members',
    required: false
  },
  counsellingSession: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CounsellingSession',
    required: true,
  },
  question: { type: String, required: true },
  answer: { type: String, required: true },
}, { timestamps: true });

const SurveyResponse = mongoose.model('SurveyResponse', surveyResponseSchema);

module.exports = SurveyResponse; 

// in the surveyresponse also heatmap