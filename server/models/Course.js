const mongoose = require('mongoose')

const chapterSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, default: "none" },
    description: { type: String, required: true },
    videoLink: { type: String, required: true },
    duration: { type: Number, required: true },
}, {
    _id: true
})

const courseSchema = new mongoose.Schema({
    category: { type: String, required: true },
    chapters: [chapterSchema],
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    instructorName: { type: String, required: true },
    language: { type: String, required: true },
    level: { type: String, enum: ["beginner", "intermediate", "advanced"], required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ['published', 'unpublished'], default: 'unpublished' },
    visibility: { type: String, enum: ['public', 'private'], default: 'public' },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: false })
module.exports = mongoose.model("Course", courseSchema)