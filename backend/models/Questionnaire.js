const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    questionType: { type: String, enum: ['MCQ', 'YesNo', 'Rating'], required: true },
    options: [{ type: String }] // Only for MCQ
});

const questionnaireSchema = new mongoose.Schema({
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CounsellingSession',
        required: true,
        unique: true
    },
    questions: [questionSchema]
}, { timestamps: true });


const Questionnaire = mongoose.model('Questionnaire', questionnaireSchema);

module.exports = Questionnaire; 