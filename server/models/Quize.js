const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: { type: [String], required: true,validate:{
        validator:function(v){
            return v.length >= 2
        },
        message:'Options array must have at least two items'
    } },
    correctAnswer: String,

}, {
    _id: true
});

const quizSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    questions: [questionSchema]
})

module.exports = mongoose.model('Quiz', quizSchema)